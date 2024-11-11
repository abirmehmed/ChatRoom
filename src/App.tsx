import React, { useState, useEffect } from 'react';
import { User, ChatGroup, ChatState } from './types';
import { loadState, saveState, addUser, addGroup, updateUser, updateGroup, deleteGroup, deleteUser } from './utils/storage';
import UserList from './components/UserList';
import ChatGroupList from './components/ChatGroupList';
import ChatRoom from './components/ChatRoom';
import ProductivityTools from './components/ProductivityTools';
import Clock from './components/Clock';

function App() {
  const [state, setState] = useState<ChatState>({
    users: {},
    groups: [],
    currentGroup: null,
    currentUser: null,
  });

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  const handleSelectGroup = (groupId: string) => {
    setState((prevState) => ({ ...prevState, currentGroup: groupId }));
  };

  const handleAddGroup = () => {
    const name = prompt('Enter group name:');
    if (name) {
      const newGroup: ChatGroup = {
        id: Date.now().toString(),
        name,
        members: [],
        avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${name}`,
      };
      setState((prevState) => {
        const newState = addGroup(prevState, newGroup);
        saveState(newState);
        return newState;
      });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setState((prevState) => {
        const newState = deleteGroup(prevState, groupId);
        saveState(newState);
        return newState;
      });
    }
  };

  const handleReorderGroups = (newGroups: ChatGroup[]) => {
    setState((prevState) => {
      const newState = { ...prevState, groups: newGroups };
      saveState(newState);
      return newState;
    });
  };

  const handleAddUser = (groupId: string) => {
    const name = prompt('Enter member name:');
    if (name) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${Date.now()}`,
        messageColor: '#3B82F6',
      };
      setState((prevState) => {
        const newState = addUser(prevState, groupId, newUser);
        saveState(newState);
        return newState;
      });
    }
  };

  const handleDeleteUser = (groupId: string, userId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setState((prevState) => {
        const newState = deleteUser(prevState, groupId, userId);
        saveState(newState);
        return newState;
      });
    }
  };

  const handleUpdateGroupAvatar = async (groupId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAvatar = e.target?.result as string;
          setState((prevState) => {
            const updatedGroup = prevState.groups.find(g => g.id === groupId);
            if (updatedGroup) {
              const newGroup = { ...updatedGroup, avatar: newAvatar };
              const newState = updateGroup(prevState, newGroup);
              saveState(newState);
              return newState;
            }
            return prevState;
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUpdateUserAvatar = async (groupId: string, userId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAvatar = e.target?.result as string;
          setState((prevState) => {
            const updatedUser = prevState.users[groupId]?.find(u => u.id === userId);
            if (updatedUser) {
              const newUser = { ...updatedUser, avatar: newAvatar };
              const newState = updateUser(prevState, groupId, newUser);
              saveState(newState);
              return newState;
            }
            return prevState;
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleUpdateUserName = (groupId: string, userId: string) => {
    const user = state.users[groupId]?.find(u => u.id === userId);
    if (user) {
      const newName = prompt('Enter new name:', user.name);
      if (newName && newName !== user.name) {
        setState((prevState) => {
          const newUser = { ...user, name: newName };
          const newState = updateUser(prevState, groupId, newUser);
          saveState(newState);
          return newState;
        });
      }
    }
  };

  const handleUpdateGroupName = (groupId: string) => {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
      const newName = prompt('Enter new group name:', group.name);
      if (newName && newName !== group.name) {
        setState((prevState) => {
          const newGroup = { ...group, name: newName };
          const newState = updateGroup(prevState, newGroup);
          saveState(newState);
          return newState;
        });
      }
    }
  };

  const handleUpdateUserColor = (groupId: string, userId: string) => {
    const user = state.users[groupId]?.find(u => u.id === userId);
    if (user) {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = user.messageColor || '#3B82F6';
      input.onchange = (e) => {
        const newColor = (e.target as HTMLInputElement).value;
        setState((prevState) => {
          const newUser = { ...user, messageColor: newColor };
          const newState = updateUser(prevState, groupId, newUser);
          saveState(newState);
          return newState;
        });
      };
      input.click();
    }
  };

  const handleSelectUser = (userId: string) => {
    setState((prevState) => ({ ...prevState, currentUser: userId }));
  };

  const currentGroupUsers = state.currentGroup && state.users[state.currentGroup] ? state.users[state.currentGroup] : [];
  const currentGroupData = state.currentGroup ? state.groups.find((g) => g.id === state.currentGroup) : null;
  const currentUser = state.currentUser && currentGroupUsers.find(u => u.id === state.currentUser) || null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex items-center p-4 bg-gray-800 sticky top-0 z-50">
        <div className="flex-1">
          <Clock />
        </div>
        <div className="flex-1 flex justify-center">
          <ProductivityTools />
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="p-2 bg-gray-800 shadow-md sticky top-[72px] z-40">
        <ChatGroupList
          groups={state.groups}
          currentGroup={state.currentGroup}
          onSelectGroup={handleSelectGroup}
          onAddGroup={handleAddGroup}
          onDeleteGroup={handleDeleteGroup}
          onUpdateAvatar={handleUpdateGroupAvatar}
          onReorderGroups={handleReorderGroups}
          onUpdateName={handleUpdateGroupName}
        />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 bg-gray-800 sticky top-0 z-30">
            <h2 className="text-lg font-semibold mb-4">Members</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pt-0">
            {state.currentGroup && (
              <UserList
                users={currentGroupUsers}
                onAddUser={() => handleAddUser(state.currentGroup!)}
                onDeleteUser={(userId) => handleDeleteUser(state.currentGroup!, userId)}
                onUpdateAvatar={(userId) => handleUpdateUserAvatar(state.currentGroup!, userId)}
                onUpdateName={(userId) => handleUpdateUserName(state.currentGroup!, userId)}
                onUpdateColor={(userId) => handleUpdateUserColor(state.currentGroup!, userId)}
                onSelectUser={handleSelectUser}
                selectedUserId={state.currentUser}
              />
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {state.currentGroup && currentGroupData && (
            <ChatRoom
              currentGroup={currentGroupData}
              users={currentGroupUsers}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;