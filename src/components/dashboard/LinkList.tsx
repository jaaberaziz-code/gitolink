'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiSave,
  FiX,
} from 'react-icons/fi'
import type { Link } from '@/types'

interface LinkItemProps {
  link: Link & { isOptimistic?: boolean; isUpdating?: boolean; isDeleting?: boolean; originalData?: Link }
  onUpdate: (id: string, updates: Partial<Link>) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

function LinkItem({ link, onUpdate, onDelete, onToggleActive }: LinkItemProps) {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: link.title,
    url: link.url,
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
    opacity: isDragging ? 0.5 : link.isDeleting ? 0.5 : 1,
  }

  const handleSave = async () => {
    if (editData.title === link.title && editData.url === link.url) {
      setEditing(false)
      return
    }
    
    setEditing(false)
    await onUpdate(link.id, editData)
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    await onDelete(link.id)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setEditData({ title: link.title, url: link.url })
  }

  // Loading state indicator
  if (link.isOptimistic) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-dark rounded-lg p-4 flex items-center gap-4 opacity-70"
      >
        <div className="text-gray-500 cursor-grab">
          <FiMoreVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium truncate">{link.title}</h3>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
              <FiLoader className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate">{link.url}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">0 clicks</span>
          <div className="p-2 text-gray-600">
            <FiExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    )
  }

  // Updating state
  if (link.isUpdating) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-dark rounded-lg p-4 flex items-center gap-4"
      >
        <div className="text-gray-500 cursor-grab" {...attributes} {...listeners}>
          <FiMoreVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium truncate">{link.title}</h3>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1">
              <FiLoader className="w-3 h-3 animate-spin" />
              Updating...
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate">{link.url}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">{link._count?.clicks || 0} clicks</span>
        </div>
      </div>
    )
  }

  // Deleting state
  if (link.isDeleting) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="glass-dark rounded-lg p-4 flex items-center gap-4 opacity-50"
      >
        <div className="text-gray-500">
          <FiMoreVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate line-through">{link.title}</h3>
          <p className="text-gray-500 text-sm truncate">{link.url}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
            <FiLoader className="w-3 h-3 animate-spin" />
            Deleting...
          </span>
        </div>
      </div>
    )
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            <FiSave className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            <FiX className="w-4 h-4" />
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
        !link.active && 'opacity-60'
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
          onClick={() => onToggleActive(link.id)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {link.active ? (
            <FiEye className="w-4 h-4" />
          ) : (
            <FiEyeOff className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <FiAlertCircle className="w-5 h-5" />
              <span className="font-medium">Delete this link?</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface LinkListProps {
  links: (Link & { isOptimistic?: boolean; isUpdating?: boolean; isDeleting?: boolean; originalData?: Link })[]
  onUpdateLink: (id: string, updates: Partial<Link>) => void
  onDeleteLink: (id: string) => void
  onReorderLinks: (newOrder: string[]) => void
  onToggleActive: (id: string) => void
}

export default function LinkList({ 
  links, 
  onUpdateLink, 
  onDeleteLink, 
  onReorderLinks, 
  onToggleActive 
}: LinkListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [items, setItems] = useState(links)

  // Sync items with props
  if (JSON.stringify(items.map(i => i.id)) !== JSON.stringify(links.map(l => l.id))) {
    setItems(links)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Call parent reorder handler
      await onReorderLinks(newItems.map((i) => i.id))
    }
  }, [items, onReorderLinks])

  const activeItem = items.find(item => item.id === activeId)

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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 relative">
          {items.map((link) => (
            <LinkItem 
              key={link.id} 
              link={link} 
              onUpdate={onUpdateLink}
              onDelete={onDeleteLink}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeItem ? (
          <div className="glass-dark rounded-lg p-4 flex items-center gap-4 opacity-90 shadow-2xl cursor-grabbing">
            <div className="text-gray-500">
              <FiMoreVertical className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{activeItem.title}</h3>
              <p className="text-gray-500 text-sm truncate">{activeItem.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">{activeItem._count?.clicks || 0} clicks</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
