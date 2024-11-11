import React from 'react';
import { ChatGroup } from '../types';
import { Image, Plus, Trash, GripHorizontal, Edit2 } from 'lucide-react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChatGroupListProps {
  groups: ChatGroup[];
  currentGroup: string | null;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onUpdateAvatar: (groupId: string) => void;
  onReorderGroups: (groups: ChatGroup[]) => void;
  onUpdateName: (groupId: string) => void;
}

const SortableGroupItem: React.FC<{
  group: ChatGroup;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateAvatar: () => void;
  onUpdateName: () => void;
}> = ({ group, isActive, onSelect, onDelete, onUpdateAvatar, onUpdateName }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative inline-flex items-center p-2 rounded-lg cursor-pointer mr-2 ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-2"
      >
        <GripHorizontal size={16} className="text-gray-400" />
      </div>
      <div className="relative">
        <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full mr-3" />
        <button
          className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateAvatar();
          }}
        >
          <Image size={12} />
        </button>
      </div>
      <span className="font-medium">{group.name}</span>
      <div className="ml-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-blue-400 hover:text-blue-300"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateName();
          }}
        >
          <Edit2 size={16} />
        </button>
        <button
          className="text-red-400 hover:text-red-300"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

const ChatGroupList: React.FC<ChatGroupListProps> = ({
  groups,
  currentGroup,
  onSelectGroup,
  onAddGroup,
  onDeleteGroup,
  onUpdateAvatar,
  onReorderGroups,
  onUpdateName,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((group) => group.id === active.id);
      const newIndex = groups.findIndex((group) => group.id === over.id);
      
      const newGroups = [...groups];
      const [movedGroup] = newGroups.splice(oldIndex, 1);
      newGroups.splice(newIndex, 0, movedGroup);
      
      onReorderGroups(newGroups);
    }
  };

  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map(g => g.id)} strategy={horizontalListSortingStrategy}>
          {groups.map((group) => (
            <SortableGroupItem
              key={group.id}
              group={group}
              isActive={group.id === currentGroup}
              onSelect={() => onSelectGroup(group.id)}
              onDelete={() => onDeleteGroup(group.id)}
              onUpdateAvatar={() => onUpdateAvatar(group.id)}
              onUpdateName={() => onUpdateName(group.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        className="inline-flex items-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onAddGroup}
      >
        <Plus size={20} className="mr-1" /> Add Group
      </button>
    </div>
  );
};

export default ChatGroupList;