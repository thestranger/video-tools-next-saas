'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Check, Sparkles, Shield, Zap, HighDefinition, Music, Lightning } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function WatermarkRemoverPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedVideo(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        console.error('Upload failed');
        setIsUploading(false);
        alert('Upload failed. Please try again.');
      });

      // Send request
      xhr.open('POST', '/api/upload-video');
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      alert('Upload failed. Please try again.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Free Sora Watermark Remover</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Remove Sora watermarks with AI - instant, private, and pristine quality
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">100% Automatic</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">HD Quality</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Preserves Audio</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">All Formats</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle>Upload Video</CardTitle>
                <CardDescription>Drag & drop your video here</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Drag & drop your video here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <Button type="button">Click to browse</Button>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Uploading...</span>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {uploadedVideo && !isUploading && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">{uploadedVideo.name}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">Video uploaded successfully!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result Area */}
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Your processed video will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  {uploadedVideo && !isUploading ? (
                    <div className="space-y-4">
                      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <video
                          src={URL.createObjectURL(uploadedVideo)}
                          controls
                          className="max-w-full max-h-full rounded-lg"
                        />
                      </div>
                      <Button size="lg" className="w-full">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Process & Remove Watermark
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-30" />
                      <p className="text-gray-500">Upload a video to get started</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Our AI-powered technology intelligently detects and removes Sora watermarks while preserving video quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our advanced AI automatically detects Sora watermarks in your video, regardless of their position,
                  size, or transparency level.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Smart Removal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Using intelligent inpainting algorithms, we seamlessly remove the watermark while maintaining the
                  original video quality and frame consistency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Private & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your videos are automatically deleted after 24 hours and we don't store any personal information.
                  Completely private and safe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See The Difference</h2>
            <p className="text-lg text-gray-600">
              Our AI technology removes watermarks perfectly while preserving video quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Before</CardTitle>
                <CardDescription>Video with watermark</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm text-gray-500">Sample video with watermark</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader>
                <CardTitle>After</CardTitle>
                <CardDescription className="text-green-600">Video without watermark</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-600">Watermark Free</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Does this work with all Sora videos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! Our tool is specifically designed to detect and remove Sora watermarks from any video, regardless
                  of resolution or length.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Will the video quality be affected?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No. We use advanced AI inpainting techniques that remove the watermark while preserving the original
                  video quality. The result is indistinguishable from the original unwatermarked footage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does processing take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Processing time varies based on video length and complexity, typically ranging from 30 seconds to 2
                  minutes. You'll see real-time progress updates during processing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this tool private and secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely. Your videos are automatically deleted after 24 hours and we don't store any personal
                  information. The tool is completely private and safe to use.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are the usage limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Guest Users</span>
                    <span className="text-gray-600">5 videos / 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Registered Users</span>
                    <span className="text-gray-600">5 videos / 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Premium Subscribers</span>
                    <span className="text-blue-600 font-semibold">100 videos / 24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
