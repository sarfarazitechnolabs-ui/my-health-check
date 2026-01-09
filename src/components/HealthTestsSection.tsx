import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { FlaskConical, Plus, Check, Calendar } from "lucide-react";

interface TestResult {
  id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
}

const TEST_TYPES = [
  { id: "testosterone", name: "Testosterone", unit: "ng/dL", placeholder: "300-1000" },
  { id: "wbc", name: "White Blood Cell (WBC)", unit: "cells/mcL", placeholder: "4,500-11,000" },
  { id: "rbc", name: "Red Blood Cell (RBC)", unit: "million/mcL", placeholder: "4.5-5.5" },
  { id: "hemoglobin", name: "Hemoglobin", unit: "g/dL", placeholder: "13.5-17.5" },
  { id: "cholesterol", name: "Total Cholesterol", unit: "mg/dL", placeholder: "<200" },
  { id: "glucose", name: "Fasting Glucose", unit: "mg/dL", placeholder: "70-100" },
  { id: "vitaminD", name: "Vitamin D", unit: "ng/mL", placeholder: "30-100" },
  { id: "iron", name: "Iron", unit: "mcg/dL", placeholder: "60-170" },
];

export const HealthTestsSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [testValue, setTestValue] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedTests, setSavedTests] = useState<TestResult[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const selectedTestInfo = TEST_TYPES.find(t => t.id === selectedTest);

  const handleSubmit = () => {
    if (!selectedTest || !testValue) return;
    
    const newTest: TestResult = {
      id: `${selectedTest}-${Date.now()}`,
      type: selectedTestInfo?.name || selectedTest,
      value: testValue,
      unit: selectedTestInfo?.unit || "",
      date: testDate,
    };
    
    setSavedTests(prev => [newTest, ...prev]);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setSelectedTest("");
      setTestValue("");
      setTestDate(new Date().toISOString().split('T')[0]);
    }, 1500);
  };

  const recentTests = savedTests.slice(0, 3);

  return (
    <>
      <div className="rounded-2xl bg-card shadow-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Health Tests</h3>
              <p className="text-xs text-muted-foreground">Track your lab results</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => setModalOpen(true)}
            className="rounded-full h-8 px-3"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {recentTests.length > 0 ? (
          <div className="space-y-2">
            {recentTests.map(test => (
              <div 
                key={test.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{test.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(test.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{test.value}</p>
                  <p className="text-xs text-muted-foreground">{test.unit}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No tests recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your blood test results to track over time</p>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Submit Test Result
            </DialogTitle>
            <DialogDescription>
              Record your blood test results to track your health over time.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 check-animation">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">Test Saved!</p>
              <p className="text-sm text-muted-foreground">Your result has been recorded</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Test Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Test Type</label>
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPES.map(test => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Test Value Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Result Value</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={selectedTestInfo?.placeholder || "Enter value"}
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                    className="flex-1"
                  />
                  {selectedTestInfo && (
                    <div className="flex items-center px-3 rounded-md bg-secondary text-sm text-muted-foreground min-w-fit">
                      {selectedTestInfo.unit}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Test Date</label>
                <Input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full mt-4" 
                onClick={handleSubmit}
                disabled={!selectedTest || !testValue}
              >
                Submit Result
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
