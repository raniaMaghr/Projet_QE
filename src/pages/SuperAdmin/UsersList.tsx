import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Pencil, Trash2 } from 'lucide-react';

function formatValue(v: any) {
  if (v === null || v === undefined) return '-';
  if (typeof v === 'object') return JSON.stringify(v);
  if (typeof v === 'string') {
    const t = Date.parse(v);
    if (!isNaN(t)) return new Date(v).toLocaleString();
  }
  return String(v);
}

export default function UsersList({
  reloadKey,
  search,
  searchField,
  onEdit,
  onDelete
}: {
  reloadKey?: number;
  search?: string;
  searchField?: string;
  onEdit: (user: any) => void;
  onDelete: (userId: string) => void;
}): JSX.Element {
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data: profiles, error: supabaseError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (supabaseError) {
          setError(supabaseError.message);
          setUsers([]);
          return;
        }

        setUsers(profiles || []);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Always attempt to load data immediately (other pages do this on mount).
    setLoading(true);
    loadData();

    return () => { isMounted = false; };
  }, [reloadKey]);

  const displayUsers = users ?? [];
  
  const filteredUsers = useMemo(() => {
    if (!search) return displayUsers;
    const s = search.toLowerCase();
    if (!searchField || searchField === 'all') {
      return displayUsers.filter(u =>
        Object.values(u).some(val => {
          if (val === null || val === undefined) return false;
          let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return str.toLowerCase().includes(s);
        })
      );
    } else {
      return displayUsers.filter(u => {
        const val = u[searchField];
        if (val === null || val === undefined) return false;
        let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return str.toLowerCase().includes(s);
      });
    }
  }, [displayUsers, search, searchField]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-3 text-slate-600">Chargement des utilisateurs...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600">Erreur: {error}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Année</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rôle</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedUsers.map((u) => (
              <tr key={u.id ?? Math.random()} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {u.first_name || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">
                  {u.last_name || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">
                  {u.email || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700">
                  {u.year ? `J${u.year}` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'superAdmin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {u.role || 'student'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(u)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(u.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedUsers.map((u) => (
          <div key={u.id ?? Math.random()} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-900">
                  {u.first_name} {u.last_name}
                </h3>
                <p className="text-sm text-slate-600">{u.email || '-'}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Année: {u.year ? `J${u.year}` : '-'}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                u.role === 'superAdmin' ? 'bg-purple-100 text-purple-800' :
                u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {u.role || 'student'}
              </span>
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onEdit(u)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => onDelete(u.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-slate-200 rounded-b-lg shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-sm text-slate-700">
            Page {currentPage} sur {totalPages}
          </span>
          <select
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            {[5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-slate-600"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            title="Première page"
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-slate-600"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="Page précédente"
          >
            {'<'}
          </button>
          <span className="text-sm text-slate-700 px-4 py-1.5 font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-slate-600"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            title="Page suivante"
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-slate-600"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Dernière page"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}