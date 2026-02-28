/**
 * Page d'accueil publique (landing page)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Logo } from '../components/Logo';
import { ArrowRight, Check } from 'lucide-react';
import brainIllustration from 'figma:asset/8bbf05d78c8c01c04ddbd6460f4d0f9ab0303685.png';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    'Plus de 10,000 questions QCM',
    'Contenu adapté aux 4 facultés tunisiennes',
    'Examens blancs avec correction détaillée',
    'Suivi personnalisé de votre progression',
    'Répétition espacée intelligente',
    'Cours et résumés de qualité',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="primary" size="md" />
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
              🎯 Plateforme éducative médicale
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl">
              Réussissez votre <br />
              <span className="font-bold tracking-tight">
                <span className="text-medical-blue">Résidanat</span>{' '}
                <span className="text-medical-orange">Médical</span>
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl">
              La plateforme de référence pour les étudiants en médecine tunisiens. 
              Entraînez-vous avec des milliers de QCM, suivez votre progression et 
              réussissez vos examens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg"
              >
                Se connecter
              </Button>
            </div>

            {/* Features List */}
            <div className="pt-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-ecg-green/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-ecg-green" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <img 
              src={brainIllustration} 
              alt="Medical Brain Illustration" 
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-primary mb-2">10,000+</div>
              <div className="text-slate-600">Questions QCM</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-accent mb-2">4</div>
              <div className="text-slate-600">Facultés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-ecg-green mb-2">2022-2025</div>
              <div className="text-slate-600">Années</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-medical-red mb-2">J1 & J2</div>
              <div className="text-slate-600">Niveaux</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl mb-4">
            Prêt à commencer votre préparation ?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Rejoignez des milliers d'étudiants qui réussissent avec QE.tn
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/register')}
            className="text-lg"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo variant="primary" size="sm" />
            <p className="text-sm text-slate-600">
              © 2025 QE.tn - Tous droits réservés
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-primary">À propos</a>
              <a href="#" className="hover:text-primary">Contact</a>
              <a href="#" className="hover:text-primary">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
