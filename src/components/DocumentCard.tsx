import React, { useState } from 'react';
import { Download, Star, Eye, Loader2 } from 'lucide-react';
import type { Document } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(document.download_count);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if document is favorited on component mount
  React.useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, document.id]);

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('document_id', document.id)
        .eq('user_id', user?.id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleView = async () => {
    if (!document.file_url) return;
    window.open(document.file_url, '_blank');
  };

  const handleDownload = async () => {
    if (!document.file_url || loading) return;
    setLoading(true);

    try {
      // Increment download count
      const { error } = await supabase.rpc('increment_download_count', {
        doc_id: document.id
      });

      if (error) throw error;

      // Update local state
      setDownloadCount(prev => prev + 1);

      // Trigger download
      const response = await fetch(document.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('document_id', document.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            document_id: document.id,
            user_id: user.id
          });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{document.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{document.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-4">{document.university}</span>
          <span>{document.course}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleFavorite}
              disabled={loading || !user}
              className={`flex items-center ${isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`}
            >
              <Star className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">{downloadCount}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleView}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}