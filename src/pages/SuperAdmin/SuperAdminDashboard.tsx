import React, { useState } from 'react';
import UsersList from './UsersList';
import CreateUserModal from './CreateUserModal';

export default function SuperAdminDashboard(): JSX.Element {
  const [showCreate, setShowCreate] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleCreated = () => {
    setShowCreate(false);
    // bump reload key to force UsersList to refetch
    setReloadKey(k => k + 1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Super Admin — Gestion des utilisateurs</h1>
          <p className="mt-2 text-sm text-muted-foreground">Liste des utilisateurs enregistrés dans la base de données.</p>
        </div>
        <div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90"
          >
            + Ajouter un utilisateur
          </button>
        </div>
      </div>

      <div className="mt-6">
        <UsersList reloadKey={reloadKey} />
      </div>

      {showCreate && (
        <CreateUserModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}