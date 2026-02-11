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
import type { Link } from '@/types'

// SVG Icons
const Icons = {
  drag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  loader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 animate-spin">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <triangle points="10 14 12 12 14 14" />
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-12 h-12">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

interface LinkItemProps {
  link: Link & { isOptimistic?: boolean; isUpdating?: boolean; isDeleting?: boolean; originalData?: Link }
  onUpdate: (id: string, updates: Partial<Link>) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

function LinkItem({ link, onUpdate, onDelete, onToggleActive }: LinkItemProps) {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ title: link.title, url: link.url })
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

  // Loading states
  if (link.isOptimistic) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 flex items-center gap-4 opacity-70">
        <div className="text-gray-600">{Icons.drag}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{link.title}</h3>
            <span className="px-2 py-0.5 bg-[#00FF41]/20 text-[#00FF41] text-xs font-mono flex items-center gap-1">
              {Icons.loader}
              SAVING...
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate font-mono">{link.url}</p>
        </div>
        <span className="text-gray-600 text-sm font-mono">0 clicks</span>
      </div>
    )
  }

  if (link.isUpdating) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 flex items-center gap-4">
        <div className="text-gray-600 cursor-grab" {...attributes} {...listeners}>{Icons.drag}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{link.title}</h3>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-mono flex items-center gap-1">
              {Icons.loader}
              UPDATING...
            </span>
          </div>
          <p className="text-gray-500 text-sm truncate font-mono">{link.url}</p>
        </div>
        <span className="text-gray-500 text-sm font-mono">{link._count?.clicks || 0} clicks</span>
      </div>
    )
  }

  if (link.isDeleting) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 flex items-center gap-4 opacity-50">
        <div className="text-gray-600">{Icons.drag}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate line-through">{link.title}</h3>
          <p className="text-gray-500 text-sm truncate font-mono">{link.url}</p>
        </div>
        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-mono flex items-center gap-1">
          {Icons.loader}
          DELETING...
        </span>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 p-4 space-y-3">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full bg-black border border-gray-700 px-3 py-2 text-white focus:border-[#00FF41] focus:outline-none"
          placeholder="Link title"
        />
        <input
          type="url"
          value={editData.url}
          onChange={(e) => setEditData({ ...editData, url: e.target.value })}
          className="w-full bg-black border border-gray-700 px-3 py-2 text-white focus:border-[#00FF41] focus:outline-none"
          placeholder="https://example.com"
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 font-medium hover:bg-gray-200 transition-colors"
          >
            {Icons.save}
            SAVE
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-2 border border-gray-700 text-gray-300 px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            {Icons.x}
            CANCEL
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-[#0a0a0a] border border-gray-800 p-4 flex items-center gap-4 ${!link.active && 'opacity-50'}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing"
        >
          {Icons.drag}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{link.title}</h3>
          <p className="text-gray-500 text-sm truncate font-mono">{link.url}</p>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm font-mono mr-2">
            {link._count?.clicks || 0} clicks
          </span>

          <a href={link.url} target="_blank" rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            {Icons.external}
          </a>

          <button onClick={() => setEditing(true)} className="p-2 text-gray-500 hover:text-white transition-colors">
            {Icons.edit}
          </button>

          <button onClick={() => onToggleActive(link.id)} className="p-2 text-gray-500 hover:text-white transition-colors">
            {link.active ? Icons.eye : Icons.eyeOff}
          </button>

          <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
            {Icons.trash}
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              {Icons.alert}
              <span className="font-bold">Delete link?</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 font-mono">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                DELETE
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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

  if (JSON.stringify(items.map(i => i.id)) !== JSON.stringify(links.map(l => l.id))) {
    setItems(links)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
      await onReorderLinks(newItems.map((i) => i.id))
    }
  }, [items, onReorderLinks])

  const activeItem = items.find(item => item.id === activeId)

  if (links.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-gray-800 p-12 text-center">
        <div className="text-gray-700 mb-4 flex justify-center">{Icons.link}</div>
        <p className="text-gray-400 mb-2">You haven't added any links yet.</p>
        <p className="text-sm text-gray-600 font-mono">Click "Add Link" to get started!</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
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
          <div className="bg-[#0a0a0a] border border-gray-800 p-4 flex items-center gap-4 opacity-90 cursor-grabbing">
            <div className="text-gray-600">{Icons.drag}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{activeItem.title}</h3>
              <p className="text-gray-500 text-sm truncate font-mono">{activeItem.url}</p>
            </div>
            <span className="text-gray-500 text-sm font-mono">{activeItem._count?.clicks || 0} clicks</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
