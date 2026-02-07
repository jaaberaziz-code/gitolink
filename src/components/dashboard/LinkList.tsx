'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiExternalLink,
} from 'react-icons/fi'
import type { Link } from '@/types'

interface LinkItemProps {
  link: Link
  onUpdate: () => void
}

function LinkItem({ link, onUpdate }: LinkItemProps) {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: link.title,
    url: link.url,
  })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleToggleActive = async () => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !link.active }),
      })

      if (res.ok) {
        onUpdate()
        toast.success(link.active ? 'Link hidden' : 'Link visible')
      }
    } catch {
      toast.error('Failed to update link')
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (res.ok) {
        setEditing(false)
        onUpdate()
        toast.success('Link updated')
      }
    } catch {
      toast.error('Failed to update link')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onUpdate()
        toast.success('Link deleted')
      }
    } catch {
      toast.error('Failed to delete link')
    }
  }

  if (editing) {
    return (
      <div className="glass-dark rounded-lg p-4 space-y-3">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          placeholder="Link title"
        />
        <input
          type="url"
          value={editData.url}
          onChange={(e) => setEditData({ ...editData, url: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          placeholder="https://example.com"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setEditData({ title: link.title, url: link.url })
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-dark rounded-lg p-4 flex items-center gap-4 ${
        !link.active && 'opacity-50'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{link.title}</h3>
        <p className="text-gray-500 text-sm truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">
          {link._count?.clicks || 0} clicks
        </span>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiExternalLink className="w-4 h-4" />
        </a>

        <button
          onClick={() => setEditing(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleActive}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {link.active ? (
            <FiEye className="w-4 h-4" />
          ) : (
            <FiEyeOff className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface LinkListProps {
  links: Link[]
  onUpdate: () => void
}

export default function LinkList({ links, onUpdate }: LinkListProps) {
  const [items, setItems] = useState(links)

  // Update items when links prop changes
  if (JSON.stringify(items.map(i => i.id)) !== JSON.stringify(links.map(l => l.id))) {
    setItems(links)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Save new order
      try {
        await fetch(`/api/links/${active.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkIds: newItems.map((i) => i.id) }),
        })
        onUpdate()
      } catch {
        toast.error('Failed to reorder links')
        setItems(links) // Revert on error
      }
    }
  }

  if (links.length === 0) {
    return (
      <div className="glass-dark rounded-xl p-12 text-center">
        <p className="text-gray-400 mb-4">You haven't added any links yet.</p>
        <p className="text-sm text-gray-500">Click "Add Link" to get started!</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((link) => (
            <LinkItem key={link.id} link={link} onUpdate={onUpdate} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
