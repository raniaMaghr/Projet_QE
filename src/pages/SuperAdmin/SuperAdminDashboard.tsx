import React, { useState } from 'react';
import UsersList from './UsersList';
import { useAuth } from '../../contexts';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import { supabase } from '../../lib/supabase';
import { AlertTriangle } from 'lucide-react';

export default function SuperAdminDashboard(): JSX.Element {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreated = () => {
    setShowCreate(false);
    setReloadKey(k => k + 1);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleEditSaved = () => {
    setShowEdit(false);
    setSelectedUser(null);
    setReloadKey(k => k + 1);
  };

  const handleDelete = async (userId: string) => {
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      setReloadKey(k => k + 1);
      setShowDeleteConfirm(null);
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const auth = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Debug - auth status (temporary) */}
        <div className="text-xs text-slate-500">
          Auth: loading={String(auth.loading)} authenticated={String(auth.isAuthenticated)} userId={auth.user?.id ?? 'null'}
        </div>
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Super Admin
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm sm:text-base text-slate-600">
              Gestion des utilisateurs
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              + Ajouter un utilisateur
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-4 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
            <select
              value={searchField}
              onChange={e => setSearchField(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
            >
              <option value="all">Tous les champs</option>
              <option value="first_name">Prénom</option>
              <option value="last_name">Nom</option>
              <option value="email">Email</option>
              <option value="faculty">Faculté</option>
              <option value="year">Année</option>
              <option value="role">Rôle</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <UsersList 
            reloadKey={reloadKey} 
            search={search} 
            searchField={searchField}
            onEdit={handleEdit}
            onDelete={(userId) => setShowDeleteConfirm(userId)}
          />
        </div>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <CreateUserModal 
          onClose={() => setShowCreate(false)} 
          onCreated={handleCreated} 
        />
      )}

      {/* Edit User Modal */}
      {showEdit && selectedUser && (
        <EditUserModal 
          user={selectedUser}
          onClose={() => {
            setShowEdit(false);
            setSelectedUser(null);
          }} 
          onSaved={handleEditSaved} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-slate-900">Confirmer la suppression</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-red-600 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {deleteLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}