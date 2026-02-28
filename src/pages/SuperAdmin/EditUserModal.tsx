import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  faculty: string | null;
  year: number | null;
  role: string | null;
}

interface Props {
  user: User;
  onClose: () => void;
  onSaved: () => void;
}

function EditUserModal({ user, onClose, onSaved }: Props) {
  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [faculty, setFaculty] = useState(user.faculty || 'FMT');
  const [year, setYear] = useState<number | null>(user.year || 1);
  const [role, setRole] = useState(user.role || 'student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          faculty: faculty || null,
          year: year !== null ? year : null,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onSaved();
    } catch (err: any) {
      console.error('EditUser error', err);
      const msg = err?.message || JSON.stringify(err) || 'Erreur lors de la modification';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Modifier l'utilisateur</h2>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              className="w-full border rounded-xl px-3 py-2 bg-slate-50" 
              value={user.email || '-'} 
              disabled 
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <input 
                className="w-full border rounded-xl px-3 py-2" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input 
                className="w-full border rounded-xl px-3 py-2" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Faculté</label>
              <select 
                className="w-full border rounded-xl px-3 py-2" 
                value={faculty} 
                onChange={e => setFaculty(e.target.value)}
              >
                <option>FMT</option>
                <option>FMS</option>
                <option>FMM</option>
                <option>FMSf</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Année</label>
              <select
                className="w-full border rounded-xl px-3 py-2"
                value={year !== null ? year : ''}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'DFG') setYear(null);
                  else setYear(Number(val));
                }}
              >
                <option value={1}>J1</option>
                <option value={2}>J2</option>
                <option value={3}>J3</option>
                <option value="DFG">DFG</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Rôle</label>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="student">Étudiant</option>
              <option value="admin">Administrateur</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-center gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded-xl"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-primary text-white rounded-xl"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { EditUserModal };
export default EditUserModal;