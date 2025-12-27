'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { isValidIP, isValidDomain } from '@/lib/ip-lookup';
import { useLanguage } from '@/lib/i18n/language-context';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  defaultValue?: string;
}

export function SearchBar({ onSearch, loading, defaultValue }: SearchBarProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  // 使用 key 属性在 defaultValue 变化时重置内部状态，而不是在 Effect 中设置状态
  // 这避免了不必要的二次渲染

  const handleSearch = () => {
    setError('');
    
    // 如果输入框为空,查询当前用户IP
    if (!query.trim()) {
      onSearch('');
      return;
    }

    // 验证输入格式
    if (!isValidIP(query) && !isValidDomain(query)) {
      setError(t.invalidInput);
      return;
    }

    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="h-12 pl-4 pr-12 bg-white/10 backdrop-blur-lg border-white/20 text-white text-2xl placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/50 transition-all hover:scale-105"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.searching}
            </>
          ) : (
            t.searchButton
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
