
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-EU', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2 
  }).format(amount);
};

export const getVarianceClass = (variance: number): string => {
  return variance < 0 
    ? "text-red-500" 
    : variance > 0 
      ? "text-green-500" 
      : "text-muted-foreground";
};

export const downloadData = (data: any, filename: string) => {
  // Convert to JSON
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
