import React, { useState } from 'react';
import { createReview } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Star, Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

function ReviewForm({ user, event, onSubmit }) {
  const [rating, setRating] = useState('5');
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = [];

    for (const file of selectedFiles) {
      // Validate file size
      if (file.size > maxFileSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
        });
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not supported (JPEG, PNG, GIF, MP4, PDF only)`,
        });
        continue;
      }

      newFiles.push(file);
    }

    // Check total file count
    if (files.length + newFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
      });
      return;
    }

    setFiles([...files, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please write a review');
      return;
    }

    if (text.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createReview(
        event.id,
        user.id,
        parseInt(rating),
        text.trim(),
        files.length > 0 ? files : null
      );

      toast({
        title: "Review Submitted! 🌟",
        description: "Thank you for sharing your experience",
      });

      onSubmit();
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Tell us about your experience at {event.title}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 - Excellent</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 - Very Good</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 - Good</SelectItem>
                <SelectItem value="2">⭐⭐ 2 - Fair</SelectItem>
                <SelectItem value="1">⭐ 1 - Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-text">Your Review</Label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience... (minimum 10 characters)"
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {text.length} characters
            </p>
          </div>

          <div className="space-y-3">
            <Label>Attachments (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              Upload photos, videos, or documents (up to {maxFiles} files, 10MB each)
            </p>

            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileSelect}
                accept={allowedTypes.map(type => {
                  if (type === 'image/jpeg') return '.jpg,.jpeg';
                  if (type === 'image/png') return '.png';
                  if (type === 'image/gif') return '.gif';
                  if (type === 'video/mp4') return '.mp4';
                  if (type === 'application/pdf') return '.pdf';
                  return '';
                }).join(',')}
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <div className="text-sm font-medium">
                  Click to upload or drag and drop
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF, MP4, or PDF
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded border"
                    >
                      <span className="text-sm truncate">
                        {file.name}
                        <span className="text-xs text-muted-foreground ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Review...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ReviewForm;