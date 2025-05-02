import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import articleService from '../../services/articleService';
import categoryService from '../../services/categoryService';
import tagService from '../../services/tagService';

const ArticleList = () => {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('category');
  const tagId = searchParams.get('tag');
  const query = searchParams.get('query');

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        
        
        const categoriesRes = await categoryService.getCategoriesWithCount();
       
        setCategories(categoriesRes || []);
        
        const tagsRes = await tagService.getAllTags();
        
        setTags(tagsRes || []);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        let response;

        if (query) {
          response = await articleService.searchArticles(query, page);
        } else if (categoryId) {
          response = await articleService.getArticlesByCategory(categoryId, page);
        } else if (tagId) {
          response = await articleService.getArticlesByTag(tagId, page);
        } else {
          response = await articleService.getAllArticles(page);
        }

        setArticles(response.data || []);
        delete response.data;
        setPagination(response);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [page, categoryId, tagId, query]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    window.location.search = params.toString();
  };

  const getTitle = () => {
    if (query) return `Search Results for "${query}"`;
    if (categoryId) {
      const category = categories.find(c => c.id === parseInt(categoryId));
      return category ? `Articles in ${category.name}` : 'Articles by Category';
    }
    if (tagId) {
      const tag = tags.find(t => t.id === parseInt(tagId));
      return tag ? `Articles tagged with ${tag.name}` : 'Articles by Tag';
    }
    return 'All Articles';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Search</h3>
          <SearchBar type="articles" placeholder="Search articles..." />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
         
          <div className="overflow-y-auto max-h-48 pr-1">
            <ul className="space-y-2">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/articles?category=${category.id}`} 
                      className={`flex justify-between items-center py-2 px-3 rounded ${
                        categoryId === category.id.toString() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full ml-2">
                        {category.articles_count || 0}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm py-2">No categories available</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Tags</h3>
          <div className="overflow-y-auto max-h-48 pr-1">
            <div className="flex flex-wrap gap-2">
              {Array.isArray(tags) && tags.length > 0 ? (
                tags.slice(0, 20).map(tag => (
                  <Link 
                    key={tag.id} 
                    to={`/articles?tag=${tag.id}`}
                    className={`text-sm px-3 py-1 rounded-full inline-block mb-2 ${
                      tagId === tag.id.toString() 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag.name}
                  </Link>
                ))
              ) : (
                <span className="text-gray-500 text-sm py-2">No tags available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
          <Link 
            to="/articles/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Article
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-medium text-white">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-yellow-600 mb-4">
              {query 
                ? `No articles match your search "${query}".` 
                : categoryId 
                  ? "No articles in this category yet." 
                  : tagId 
                    ? "No articles with this tag yet."
                    : "No articles have been published yet."}
            </p>
            <Link 
              to="/articles/create" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Write the first article
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {pagination && (
              <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
