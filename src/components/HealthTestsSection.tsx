import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { FlaskConical, Check, Calendar, Upload, FileText, X } from "lucide-react";

interface LabReport {
  id: string;
  fileName: string;
  date: string;
  fileSize: string;
}

export const HealthTestsSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedReports, setSavedReports] = useState<LabReport[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    
    const newReport: LabReport = {
      id: `report-${Date.now()}`,
      fileName: selectedFile.name,
      date: reportDate,
      fileSize: formatFileSize(selectedFile.size),
    };
    
    setSavedReports(prev => [newReport, ...prev]);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setSelectedFile(null);
      setReportDate(new Date().toISOString().split('T')[0]);
    }, 1500);
  };

  const recentReports = savedReports.slice(0, 3);

  return (
    <>
      <div className="rounded-2xl bg-card shadow-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lab Reports</h3>
              <p className="text-xs text-muted-foreground">Upload your test results</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => setModalOpen(true)}
            className="rounded-full h-8 px-3"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
        </div>

        {recentReports.length > 0 ? (
          <div className="space-y-2">
            {recentReports.map(report => (
              <div 
                key={report.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{report.fileName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{report.fileSize}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No reports uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload your blood test PDFs to share with your trainer</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Upload Lab Report
            </DialogTitle>
            <DialogDescription>
              Upload your blood test results as a PDF file.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 check-animation">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">Report Uploaded!</p>
              <p className="text-sm text-muted-foreground">Your trainer will review it soon</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* File Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : selectedFile 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                
                {selectedFile ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Test Date</label>
                <Input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full mt-4" 
                onClick={handleSubmit}
                disabled={!selectedFile}
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
