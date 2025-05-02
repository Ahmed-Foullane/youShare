import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articleService from '../../services/articleService';
import categoryService from '../../services/categoryService';
import tagService from '../../services/tagService';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    tags: [],
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);
      
      const categoriesRes = await categoryService.getAllCategories();
      const categoryData = Array.isArray(categoriesRes) ? categoriesRes : 
                        (categoriesRes && categoriesRes.data ? categoriesRes.data : []);
      setCategories(categoryData);
      
      const tagsRes = await tagService.getAllTags();
      const tagData = Array.isArray(tagsRes) ? tagsRes : 
                    (tagsRes && tagsRes.data ? tagsRes.data : []);
      setTags(tagData);
      
      if (isEditMode) {
        const articleRes = await articleService.getArticleById(id);
        if (articleRes && articleRes.data) {
          const article = articleRes.data;
          
          setFormData({
            title: article.title || '',
            content: article.content || '',
            category_id: article.category ? article.category.id.toString() : '',
            tags: [],
            image: null
          });
          
          if (article.tags && Array.isArray(article.tags)) {
            setSelectedTags(article.tags.map(tag => tag.id));
          }
          
          if (article.image) {
            setPreviewImage(`http://127.0.0.1:8000/storage/${article.image.file_path}`);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    fetchFormData();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleTagChange = (tagId) => {
    tagId = parseInt(tagId);
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter(id => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const hasFileInput = formData.image instanceof File;
      
      if (hasFileInput) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('category_id', formData.category_id);
        
        selectedTags.forEach(tagId => {
          formDataToSend.append('tags[]', tagId);
        });
        
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }
        
        let response;
        if (isEditMode) {
          formDataToSend.append('_method', 'PUT');
          response = await articleService.updateArticle(id, formDataToSend);
          if (response && response.data) {
            navigate(`/articles/${id}`);
          }
        } else {
          response = await articleService.createArticle(formDataToSend);
          if (response && response.data) {
            navigate(`/articles/${response.data.id}`);
          }
        }
      } else {
        const jsonData = {
          title: formData.title,
          content: formData.content,
          category_id: formData.category_id,
          tags: selectedTags,
        };
        
        if (previewImage && !formData.image) {
          jsonData.image = previewImage;
        }
        
        let response;
        if (isEditMode) {
          response = await articleService.updateArticle(id, jsonData);
          if (response && response.data) {
            navigate(`/articles/${id}`);
          }
        } else {
          response = await articleService.createArticle(jsonData);
          if (response && response.data) {
            navigate(`/articles/${response.data.id}`);
          }
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: 'An error occurred. Please try again later.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Article' : 'Create New Article'}
      </h1>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter article title"
            
          />
          {errors.title && <div className="text-red-500 mt-1">{errors.title[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            
          >
            <option value="">Select a category</option>
            {Array.isArray(categories) && categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <div className="text-red-500 mt-1">{errors.category_id[0]}</div>}
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tags) && tags.map(tag => (
              <label key={tag.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                />
                <span className="ml-2 text-gray-700">#{tag.name}</span>
              </label>
            ))}
          </div>
          {errors.tags && <div className="text-red-500 mt-1">{errors.tags[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className={`w-full px-3 py-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            accept="image/*"
          />
          {errors.image && <div className="text-red-500 mt-1">{errors.image[0]}</div>}
          
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Write your article content here..."
            
          />
          {errors.content && <div className="text-red-500 mt-1">{errors.content[0]}</div>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Publishing...'}
              </span>
            ) : (
              isEditMode ? 'Update Article' : 'Publish Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;