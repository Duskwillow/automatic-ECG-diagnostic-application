import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PredictionData {
  [key: string]: number;
}

interface PredictionResultsProps {
  predictions: PredictionData[];
  isLoading?: boolean;
}

const conditionLabels = {
  '1dAVb': '1st Degree AV Block',
  'RBBB': 'Right Bundle Branch Block',
  'LBBB': 'Left Bundle Branch Block',
  'SB': 'Sinus Bradycardia',
  'AF': 'Atrial Fibrillation',
  'ST': 'ST Elevation'
};

// Format very small numbers properly
const formatProbability = (value: number) => {
  if (value < 0.0001) {
    return value.toExponential(2);
  }
  return (value * 100).toFixed(4) + '%';
};

// Adjust confidence thresholds for very small values
const getConfidenceColor = (value: number) => {
  if (value > 0.01) return 'bg-destructive text-destructive-foreground';
  if (value > 0.001) return 'bg-warning text-warning-foreground';
  return 'bg-success text-success-foreground';
};

const getConfidenceIcon = (value: number) => {
  if (value > 0.01) return <AlertTriangle className="h-3 w-3" />;
  if (value > 0.001) return <Activity className="h-3 w-3" />;
  return <CheckCircle2 className="h-3 w-3" />;
};

const getRiskLevel = (value: number) => {
  if (value > 0.01) return 'High';
  if (value > 0.001) return 'Medium';
  return 'Low';
};

export const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-medical">Analysis Results</CardTitle>
          <CardDescription>Processing ECG data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-medical">Analysis Results</CardTitle>
          <CardDescription>No results available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Submit ECG data to see analysis results
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-medical">
          <Activity className="h-5 w-5" />
          ECG Analysis Results
        </CardTitle>
        <CardDescription>
          Predicted probabilities for various cardiac conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Prediction values are very small, indicating low probability of abnormalities.
            Values below 0.0001 are displayed in scientific notation.
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead className="text-right">Probability</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(predictions[0] || {}).map(([condition, probability]) => (
              <TableRow key={condition}>
                <TableCell className="font-medium">{condition}</TableCell>
                <TableCell className="text-muted-foreground">
                  {conditionLabels[condition as keyof typeof conditionLabels] || condition}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatProbability(probability)}
                </TableCell>
                <TableCell>
                  <Badge className={`${getConfidenceColor(probability)} flex items-center gap-1 w-fit`}>
                    {getConfidenceIcon(probability)}
                    {getRiskLevel(probability)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};