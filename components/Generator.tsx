import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Loader2, Download, RefreshCw, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { GenerationMode } from '../types';
import { MAX_IMAGES_MULTI, MAX_IMAGES_SINGLE } from '../constants';
import { validateFileSelection } from '../utils/imageUtils';
import { generateImageFromReferences } from '../services/geminiService';

interface GeneratorProps {
  mode: GenerationMode;
  onBack: () => void;
  onResetKey: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ mode, onBack, onResetKey }) => {

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // ✅ NEW: store multiple results (only single mode)
  const [allResults, setAllResults] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxLimit = mode === 'single' ? MAX_IMAGES_SINGLE : MAX_IMAGES_MULTI;

  const isSingleMode = mode === 'single';



  // ============================
  // File Select
  // ============================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    const combinedFiles = isSingleMode

      ? newFiles

      : [...selectedImages, ...newFiles];


    const validatedFiles = validateFileSelection(

      combinedFiles,

      maxLimit

    );


    setSelectedImages(validatedFiles);

    setError(null);

  };



  const removeImage = (index: number) => {

    setSelectedImages(prev =>

      prev.filter((_, i) => i !== index)

    );

  };



  // ============================
  // Generate
  // ============================

  const handleGenerate = async () => {

    if (selectedImages.length === 0) return;


    setIsGenerating(true);

    setError(null);

    setGeneratedImage(null);


    try {

      const imageUrl =
        await generateImageFromReferences(

          selectedImages,

          mode

        );


      setGeneratedImage(imageUrl);


      // ✅ Only for single mode save history

      if (isSingleMode) {

        setAllResults(prev => [

          ...prev,

          imageUrl

        ]);

      }


    }

    catch (err: any) {

      setError(

        err.message ||

        "Failed to generate image"

      );

    }

    finally {

      setIsGenerating(false);

    }

  };



  // ============================
  // Add another product
  // ============================

  const handleAddAnother = () => {

    setSelectedImages([]);

    setGeneratedImage(null);

    setError(null);

  };



  // ============================
  // Auth Error
  // ============================

  const isAuthError = error && (

    error.includes('API Key') ||

    error.includes('401') ||

    error.includes('403')

  );



  // ============================
  // UI
  // ============================

  return (

    <div className="w-full max-w-5xl mx-auto px-4 pb-12 animate-fade-in">


      {/* Header */}

      <div className="flex items-center mb-8 pt-4">

        <button onClick={onBack}

          className="p-2 rounded-full hover:bg-zinc-800">

          <ArrowLeft size={24} />

        </button>


        <div>

          <h2 className="text-xl font-semibold text-white">

            {isSingleMode

              ? 'Single Variant Generator'

              : 'Multi-Reference Mix'}

          </h2>

        </div>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        {/* LEFT SIDE */}

        <div className="flex flex-col gap-6">


          {/* Upload */}

          <div

            className="border-2 border-dashed rounded-2xl p-8 cursor-pointer"

            onClick={() => fileInputRef.current?.click()}

          >

            <input

              type="file"

              hidden

              ref={fileInputRef}

              accept="image/*"

              multiple={!isSingleMode}

              onChange={handleFileChange}

            />


            <Upload />

            <p>

              Click to Upload

            </p>

          </div>



          {/* Selected */}

          {selectedImages.map((file, index) => (

            <img

              key={index}

              src={URL.createObjectURL(file)}

            />

          ))}



          {/* Generate */}

          <button

            onClick={handleGenerate}

            disabled={isGenerating}

            className="bg-indigo-600 p-4 rounded-xl"

          >

            {isGenerating

              ? "Generating..."

              : "Generate Image"}

          </button>



          {/* ✅ Add Another Product */}

          {isSingleMode && generatedImage && (

            <button

              onClick={handleAddAnother}

              className="bg-zinc-800 p-3 rounded-xl"

            >

              + Add Another Product

            </button>

          )}



          {/* Errors */}

          {error && (

            <div>

              {error}

            </div>

          )}


        </div>



        {/* RIGHT SIDE */}

        <div>


          {/* Current result */}

          {generatedImage && (

            <img src={generatedImage} />

          )}



          {/* ✅ Show all previous single results */}

          {isSingleMode && allResults.length > 0 && (

            <div className="grid grid-cols-2 gap-4 mt-6">


              {allResults.map((img, i) => (

                <div key={i}>

                  <img src={img} />


                  <a href={img}

                    download={`product-${i}.png`}>

                    <Download />

                  </a>

                </div>

              ))}


            </div>

          )}


        </div>


      </div>


    </div>

  );

};


export default Generator;
