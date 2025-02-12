import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import { supabase } from '../lib/supabase';
import type { Document, DocumentFilter } from '../types';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DocumentFilter>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [filters, searchQuery]);

  const fetchDocuments = async () => {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.university) {
        query = query.eq('university', filters.university);
      }
      if (filters.course) {
        query = query.eq('course', filters.course);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share and Discover Study Materials
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access thousands of study documents from students around the world
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-gray-600">
            No documents found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}