import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionsGridView from "../components/QuestionsGridView";
import { QCMEntry, SeriesMetadata } from "../types";
import { loadSeriesFromSupabase } from "../supabaseService"; // adapte le chemin

export default function SeriesPageWrapper() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [metadata, setMetadata] = useState<SeriesMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) {
      setError("Aucun ID de série fourni dans l'URL !");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔥 Récupération depuis Supabase
        const data = await loadSeriesFromSupabase(seriesId);

        setQuestions(data.questions);
        setMetadata(data.metadata);
      } catch (err) {
        console.error("Erreur chargement série:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  if (loading) {
    return <div className="p-6 text-center">Chargement des questions...</div>;
  }

  if (error || !metadata) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <QuestionsGridView
      questions={questions}
      metadata={metadata}
      onQuestionSelect={(questionId) => {
        navigate(`/question/${questionId}`);
      }}
      onBack={() => navigate(-1)}
    />
  );
}