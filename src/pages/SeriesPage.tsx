import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Heart, Brain, Stethoscope } from "lucide-react";

export function SeriesPage() {
  const [activeTab, setActiveTab] = useState("j1");
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard");

  const goToCourse = (day: string, key: string) => {
    navigate(`/train/series/${day}/${key}`);
  };

  // ---------------- J1 ----------------
  const j1Courses = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Cardiologie – Chirurgie cardio-vasculaire",
      shortTitle: "Cardio-CCV",
      progress: "78%",
      chapters: "6 chapitres",
      key: "cardio-ccv",
    },
    {
      icon: "👶",
      title: "Gynécologie – Obstétrique",
      shortTitle: "Gynéco-Obs",
      progress: "65%",
      chapters: "6 chapitres",
      key: "gyneco",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Psychiatrie",
      shortTitle: "Psychiatrie",
      progress: "42%",
      chapters: "10 chapitres",
      key: "psychiatrie",
    },
    {
      icon: "🏥",
      title: "Chirurgie générale",
      shortTitle: "Chirurgie",
      progress: "38%",
      chapters: "6 chapitres",
      key: "chirurgie",
    },
    {
      icon: "🫄",
      title: "Gastro-entérologie",
      shortTitle: "Gastro",
      progress: "55%",
      chapters: "5 chapitres",
      key: "gastro",
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "Neurologie",
      shortTitle: "Neurologie",
      progress: "33%",
      chapters: "16 chapitres",
      key: "neurologie",
    },
    {
      icon: "👁️",
      title: "ORL – Ophtalmologie",
      shortTitle: "ORL-Ophta",
      progress: "47%",
      chapters: "11 chapitres",
      key: "orl-ophta",
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-green-500" />,
      title: "Pneumologie",
      shortTitle: "Pneumo",
      progress: "72%",
      chapters: "9 chapitres",
      key: "pneumo",
    },
  ];

  // -------------------------
  // Données J2
  // -------------------------
  const j2Courses = [
    {
      icon: "🧬",
      title: "Endocrinologie",
      shortTitle: "Endocrino",
      progress: "62%",
      chapters: "6 chapitres",
      key: "endocrino",
    },
    {
      icon: "🦠",
      title: "Maladies infectieuses",
      shortTitle: "Infectieux",
      progress: "28%",
      chapters: "17 chapitres",
      key: "infectieux",
    },
    {
      icon: "🫘",
      title: "Néphrologie",
      shortTitle: "Néphro",
      progress: "44%",
      chapters: "10 chapitres",
      key: "nephro",
    },
    {
      icon: "🦴",
      title: "Orthopédie – Rhumatologie",
      shortTitle: "Ortho-Rhumato",
      progress: "36%",
      chapters: "20 chapitres",
      key: "ortho-rhumato",
    },
    {
      icon: "🚨",
      title: "Réanimation",
      shortTitle: "Réanimation",
      progress: "58%",
      chapters: "8 chapitres",
      key: "reanimation",
    },
    {
      icon: "🩸",
      title: "Hématologie",
      shortTitle: "Hémato",
      progress: "41%",
      chapters: "5 chapitres",
      key: "hemato",
    },
    {
      icon: "👶",
      title: "Pédiatrie",
      shortTitle: "Pédiatrie",
      progress: "67%",
      chapters: "22 chapitres",
      key: "pediatrie",
    },
    {
      icon: "🫸",
      title: "Urologie",
      shortTitle: "Urologie",
      progress: "29%",
      chapters: "9 chapitres",
      key: "urologie",
    },
  ];


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-2xl font-semibold">
              📚 QCM Par Séries
            </h1>
          </div>

          <p className="text-muted-foreground">
            Navigation : J1/J2 → Spécialité → Cours → Année → Faculté → Séries
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="j1" className="text-base">
            Jour 1
          </TabsTrigger>
          <TabsTrigger value="j2" className="text-base">
            Jour 2
          </TabsTrigger>
        </TabsList>

        {/* -------- J1 -------- */}
        <TabsContent value="j1" className="space-y-4">
          <div className="grid gap-4">
            {j1Courses.map((course, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => goToCourse("j1", course.key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {course.icon}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {course.title}
                        </h3>

                        <Badge
                          variant="secondary"
                          className="font-normal"
                        >
                          6 cours
                        </Badge>
                      </div>
                    </div>

                    <Button>EXPLORER</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* -------- J2 -------- */}
        <TabsContent value="j2" className="space-y-4">
          <div className="grid gap-4">
            {j2Courses.map((course, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => goToCourse("j2", course.key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {course.icon}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {course.title}
                        </h3>

                        <Badge
                          variant="secondary"
                          className="font-normal"
                        >
                          8 cours
                        </Badge>
                      </div>
                    </div>

                    <Button>EXPLORER</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
