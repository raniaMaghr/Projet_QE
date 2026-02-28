import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  User, 
  GraduationCap, 
  Settings, 
  Search, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter
} from 'lucide-react';

const ROLE_OPTIONS = ['student', 'admin', 'superAdmin'] as const;
type Role = typeof ROLE_OPTIONS[number];

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  year: number | null;
  role: string | null;
}

export default function RoleManager() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Charger les profils
  useEffect(() => {
    loadProfiles();
  }, []);

  // Réinitialiser la page 1 quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchField]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setProfiles(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des profils:', err);
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le rôle d'un utilisateur
  const updateRole = async (userId: string, newRole: Role) => {
    try {
      setUpdatingId(userId);
      setError(null);
      setSuccessMessage(null);

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Mettre à jour localement
      setProfiles(prev => 
        prev.map(profile => 
          profile.id === userId 
            ? { ...profile, role: newRole }
            : profile
        )
      );

      setSuccessMessage('Rôle mis à jour avec succès');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du rôle:', err);
      setError(err.message || 'Erreur lors de la mise à jour du rôle');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrer les profils selon la recherche (AJAX - en temps réel)
  const filteredProfiles = useMemo(() => {
    if (!search.trim()) return profiles;
    
    const searchTerm = search.toLowerCase();
    return profiles.filter(profile => {
      const firstName = profile.first_name?.toLowerCase() || '';
      const lastName = profile.last_name?.toLowerCase() || '';
      const role = profile.role?.toLowerCase() || '';
      const year = profile.year?.toString() || '';
      
      // Recherche sur champ spécifique ou tous les champs
      if (searchField === 'all') {
        return (
          firstName.includes(searchTerm) ||
          lastName.includes(searchTerm) ||
          role.includes(searchTerm) ||
          year.includes(searchTerm)
        );
      } else if (searchField === 'first_name') {
        return firstName.includes(searchTerm);
      } else if (searchField === 'last_name') {
        return lastName.includes(searchTerm);
      } else if (searchField === 'role') {
        return role.includes(searchTerm);
      } else if (searchField === 'year') {
        return year.includes(searchTerm);
      }
      return false;
    });
  }, [profiles, search, searchField]);

  // Pagination
  const totalPages = Math.ceil(filteredProfiles.length / rowsPerPage);
  
  const paginatedProfiles = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProfiles.slice(start, start + rowsPerPage);
  }, [filteredProfiles, currentPage, rowsPerPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-7 h-7 text-primary" />
              Gestion des rôles
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Modifiez les permissions des utilisateurs
            </p>
          </div>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Barre de recherche avec filtre */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={searchField}
                onChange={e => setSearchField(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tous les champs</option>
                <option value="first_name">Prénom</option>
                <option value="last_name">Nom</option>
                <option value="role">Rôle</option>
                <option value="year">Année</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {search && (
            <p className="text-xs text-slate-500 mt-2">
              {filteredProfiles.length} résultat{filteredProfiles.length > 1 ? 's' : ''} trouvé{filteredProfiles.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-slate-600">Chargement...</span>
            </div>
          ) : paginatedProfiles.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">
                {search ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur trouvé'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Prénom
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nom
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Année
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Rôle
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {paginatedProfiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {profile.first_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {profile.last_name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {profile.year ? `J${profile.year}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={profile.role || 'student'}
                            onChange={e => updateRole(profile.id, e.target.value as Role)}
                            disabled={updatingId === profile.id}
                            className={`text-sm border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              profile.role === 'superAdmin' ? 'bg-orange-50 text-orange-800 font-medium' :
                              profile.role === 'admin' ? 'bg-purple-50 text-purple-800 font-medium' :
                              'bg-blue-50 text-blue-800'
                            } ${updatingId === profile.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {ROLE_OPTIONS.map(role => (
                              <option key={role} value={role}>
                                {role === 'student' ? 'Étudiant' : 
                                 role === 'admin' ? 'Administrateur' : 
                                 'Super Admin'}
                              </option>
                            ))}
                          </select>
                          {updatingId === profile.id && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Mise à jour...
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {paginatedProfiles.map((profile) => (
                  <div key={profile.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900">
                          {profile.first_name} {profile.last_name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Année: {profile.year ? `J${profile.year}` : '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Rôle
                      </label>
                      <select
                        value={profile.role || 'student'}
                        onChange={e => updateRole(profile.id, e.target.value as Role)}
                        disabled={updatingId === profile.id}
                        className={`w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          profile.role === 'superAdmin' ? 'bg-orange-50 text-orange-800 font-medium' :
                          profile.role === 'admin' ? 'bg-purple-50 text-purple-800 font-medium' :
                          'bg-blue-50 text-blue-800'
                        } ${updatingId === profile.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {ROLE_OPTIONS.map(role => (
                          <option key={role} value={role}>
                            {role === 'student' ? 'Étudiant' : 
                             role === 'admin' ? 'Administrateur' : 
                             'Super Admin'}
                          </option>
                        ))}
                      </select>
                      {updatingId === profile.id && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Mise à jour en cours...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination style screenshot */}
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
            </>
          )}
        </div>

      </div>
    </div>
  );
}