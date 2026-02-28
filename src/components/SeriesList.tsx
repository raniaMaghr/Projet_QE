import React, { useState, useEffect } from "react";
import { 
  getAllSeries, 
  loadSeriesFromSupabase, 
  deleteSeries,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  type SupabaseSeries 
}  from "../supabaseService.ts";
import { SeriesMetadata, QCMEntry } from "./types";
import { Trash2, Plus, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";

interface SeriesListProps {
  onSeriesLoad: (data: { metadata: SeriesMetadata; questions: QCMEntry[] }) => void;
  onNewSeries: () => void;
}

export default function SeriesList({ onSeriesLoad, onNewSeries }: SeriesListProps) {
  const [series, setSeries] = useState<SupabaseSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        loadSeries();
      }
    } catch (error) {
      console.error('Erreur vérification utilisateur:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSeries() {
    try {
      setLoading(true);
      const data = await getAllSeries();
      setSeries(data);
    } catch (error) {
      console.error('Erreur chargement séries:', error);
      toast.error('Erreur lors du chargement des séries');
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        await signIn(email, password);
        toast.success('Connexion réussie !');
      } else {
        await signUp(email, password);
        toast.success('Compte créé ! Vérifiez votre email.');
      }
      await checkUser();
    } catch (error: any) {
      console.error('Erreur auth:', error);
      toast.error(error.message || 'Erreur d\'authentification');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
      setSeries([]);
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  }

  async function handleLoadSeries(seriesId: string) {
    try {
      const data = await loadSeriesFromSupabase(seriesId);
      onSeriesLoad(data);
      toast.success('Série chargée !');
    } catch (error) {
      console.error('Erreur chargement série:', error);
      toast.error('Erreur lors du chargement');
    }
  }

  async function handleDeleteSeries(seriesId: string, seriesName: string) {
    if (!window.confirm(`Supprimer la série "${seriesName}" ?`)) return;

    try {
      await deleteSeries(seriesId);
      setSeries(series.filter(s => s.id !== seriesId));
      toast.success('Série supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  }

  // Si pas connecté, afficher le formulaire d'authentification
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
              QCM Database Builder
            </h1>
            
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Chargement...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {authMode === 'signin' ? 'Se connecter' : 'S\'inscrire'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Astuce :</strong> Créez un compte pour sauvegarder vos séries de QCM dans le cloud !
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale (utilisateur connecté)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-indigo-600">Mes séries de QCM</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <button
                onClick={onNewSeries}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Nouvelle série
              </button>
            </div>
          </div>
        </div>

        {/* Liste des séries */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des séries...</p>
          </div>
        ) : series.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Aucune série pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre première série de QCM pour commencer !
            </p>
            <button
              onClick={onNewSeries}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Créer une série
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{s.objective}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🏛️ {s.faculty}</p>
                      <p>📅 {s.year}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSeries(s.id, s.objective)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleLoadSeries(s.id)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
