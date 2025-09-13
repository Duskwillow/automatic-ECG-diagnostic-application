// ECGInput.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea'
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ECGInputProps {
  onDataSubmit: (data: number[][]) => void;
  onChartData: (data: number[][]) => void; // Change to 2D array
  isLoading?: boolean;
}

export const ECGInput: React.FC<ECGInputProps> = ({ onDataSubmit, onChartData, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      // Parse the CSV/data file
      const ecgArray: number[][] = [];
      for (const line of lines) {
        const values = line.split(',').map(Number);
        if (values.length === 12) { // Ensure we have 12 values per row
          ecgArray.push(values);
        }
      }

      // Check if we have exactly 4096 rows
      if (ecgArray.length !== 4096) {
        setError(`Expected 4096 rows, got ${ecgArray.length}. Please provide complete ECG data.`);
        return;
      }

      onDataSubmit(ecgArray);
      onChartData(ecgArray);
      setError('');
      
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Error reading file. Please ensure it contains valid ECG data.');
    }
  };

  const generateSampleData = (): number[][] => {
    // Generate 4096 rows of sample data with 12 columns each
    const sampleData: number[][] = [];
    for (let i = 0; i < 4096; i++) {
      const row: number[] = [];
      for (let j = 0; j < 12; j++) {
        // Generate some realistic-looking ECG data
        row.push(Math.sin(i / 100 + j * 0.1) * 2 + Math.random() * 0.1 - 0.05);
      }
      sampleData.push(row);
    }
    return sampleData;
  };

  const parseECGData = (input: string): number[][] | null => {
    try {
      let cleanInput = input.trim();
      
      // Handle ellipsis by generating sample data
      if (cleanInput.includes('...')) {
        return generateSampleData();
      }
      
      // Try to parse as JSON array
      if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
        const parsed = JSON.parse(cleanInput);
        if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
          return parsed;
        }
      }
      
      // Try to parse as numpy array string
      if (cleanInput.startsWith('array(')) {
        cleanInput = cleanInput.slice(6, -1).trim();
        if (cleanInput.startsWith('[') && cleanInput.endsWith(']')) {
          const parsed = JSON.parse(cleanInput);
          if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
            return parsed;
          }
        }
      }
      
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = () => {
    setError('');
    
    if (!inputValue.trim()) {
      setError('Please enter ECG data');
      return;
    }

    const parsedData = parseECGData(inputValue);
    
    if (!parsedData) {
      setError('Invalid ECG data format. Please check your input.');
      return;
    }

    // Check if we have the right shape
    if (parsedData.length !== 4096 || !parsedData[0] || parsedData[0].length !== 12) {
      setError(`Expected data shape (4096, 12), got (${parsedData.length}, ${parsedData[0]?.length || 0})`);
      return;
    }

    onChartData(parsedData);
    onDataSubmit(parsedData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-medical">
          <Upload className="h-5 w-5" />
          ECG Data Input
        </CardTitle>
        <CardDescription>
          Upload a CSV file with 4096 rows and 12 columns, or paste array data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload CSV File</Label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.txt,.json"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
            
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            File should contain 4096 rows with 12 comma-separated values each
          </p>
        </div>

      

        {/* Text Input Section 
        
         <div className="space-y-2">
          <Label htmlFor="ecg-input">Paste Array Data</Label>
          <Textarea
            id="ecg-input"
            placeholder="Paste your 4096x12 array data here or use: array([[...]]) format"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={6}
            className="font-mono text-sm"
            disabled={isLoading}
          />
        </div>
         {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full bg-medical hover:bg-medical-dark"
        >
          {isLoading ? 'Processing...' : 'Analyze ECG Data'}
        </Button>
        
        */}
       
       
      </CardContent>
    </Card>
  );
};