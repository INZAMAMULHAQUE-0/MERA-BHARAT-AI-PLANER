import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/";
import { Checkbox } from "./components/ui/Checkbox";
import { Card, CardContent } from "./components/ui/Card";
import { Loader2 } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function SmartTravelPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    startDate: "",
    budgetCategory: "economy",
    interests: [],
  });
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const userId = localStorage.getItem("userId") || `user-${Date.now()}`;

  const interests = [
    { value: "Culture", icon: "🏛️" },
    { value: "Nature", icon: "🌲" },
    { value: "Adventure", icon: "🏃" },
    { value: "Food", icon: "🍽️" },
    { value: "Shopping", icon: "🛍️" },
    { value: "Relaxation", icon: "🌅" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowItinerary(true);

    try {
      const aiResponse = await fetch("https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai", {
        method: "POST",
        headers: {
          Authorization: "Bearer Tlv0OQcRm5facwZp1ZA4pygCFRk1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: [{
              type: "text",
              text: `Create a detailed ${formData.duration}-day travel itinerary for ${formData.destination} with ${formData.budgetCategory} budget category. Start date: ${formData.startDate}. Interests: ${formData.interests.join(", ")}.`,
            }],
          }],
        }),
      });

      const aiData = await aiResponse.json();
      setCurrentItinerary(aiData.message);

      await fetch("https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db", {
        method: "POST",
        headers: {
          Authorization: "Bearer Tlv0OQcRm5facwZp1ZA4pygCFRk1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          appSlug: "smart-travel-planner",
          action: "create",
          table: "itineraries",
          data: { ...formData, itinerary: aiData.message },
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomize = async () => {
    const customPrompt = prompt("How would you like to customize your itinerary?");
    if (customPrompt) {
      setIsLoading(true);
      try {
        const aiResponse = await fetch("https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai", {
          method: "POST",
          headers: {
            Authorization: "Bearer Tlv0OQcRm5facwZp1ZA4pygCFRk1",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: [{
                type: "text",
                text: `Please modify this itinerary with the following changes: ${customPrompt}\n\nOriginal itinerary:\n${currentItinerary}`,
              }],
            }],
          }),
        });

        const aiData = await aiResponse.json();
        setCurrentItinerary(aiData.message);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveItinerary = () => {
    const element = document.getElementById("itineraryContent");
    const opt = {
      margin: 1,
      filename: "smart-travel-itinerary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {!showItinerary ? (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="bi bi-airplane-engines text-blue-600 mr-3" />
             MERA BHARAT YATRA
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Paris, France"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    type="number"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="budgetCategory">Budget Category</Label>
                  <Select
                    value={formData.budgetCategory}
                    onValueChange={(value) => setFormData({ ...formData, budgetCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy ($50-150/day)</SelectItem>
                      <SelectItem value="standard">Standard ($150-300/day)</SelectItem>
                      <SelectItem value="luxury">Luxury ($300+/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {interests.map((interest) =>(
                    <div key={interest.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        checked={formData.interests.includes(interest.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              interests: [...formData.interests, interest.value],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              interests: formData.interests.filter((i) => i !== interest.value),
                            });
                          }
                        }}/>
                      <span>
                        {interest.icon} {interest.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                <i className="bi bi-magic mr-2" /> Generate Smart Itinerary
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <i className="bi bi-map text-blue-600 mr-3" />
                Your Smart Itinerary
              </h2>
              <Button variant="ghost" onClick={() => setShowItinerary(false)}>
                <i className="bi bi-arrow-left mr-1" /> Back
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div id="itineraryContent" className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: currentItinerary?.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>')
                }}
              />
            )}

            <div className="mt-6 space-y-4">
              <Button onClick={handleCustomize} className="w-full" variant="secondary">
                <i className="bi bi-pencil mr-2" /> Customize Itinerary
              </Button>
              <Button onClick={saveItinerary} className="w-full">
                <i className="bi bi-file-pdf mr-2" /> Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}