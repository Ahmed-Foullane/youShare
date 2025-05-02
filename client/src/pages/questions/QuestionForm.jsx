import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import tagService from '../../services/tagService';

const QuestionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    image: null
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoading(true);

        try {
          const tagsRes = await tagService.getAllTags();
          
          if (Array.isArray(tagsRes) && tagsRes.length > 0) {
            setTags(tagsRes);
          } else {
            console.warn('Tags data is not in expected format:', tagsRes);
            setTags([]);
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
          setTags([]);
        }
        
        if (isEditMode) {
          try {
            const questionRes = await questionService.getQuestionById(id);

            const question = questionRes.data;
            
            setFormData({
              title: question.title || '',
              description: question.description || '',
              tags: [],
              image: null
            });
            
            if (question.tags && Array.isArray(question.tags)) {
              setSelectedTags(question.tags.map(tag => tag.id));
            }
            
            if (question.image) {
              setPreviewImage(`http://127.0.0.1:8000/storage/${question.image.file_path}`);
            }
          } catch (error) {
            console.error('Error fetching question:', error);
            setErrors({
              general: 'Could not load question data. Please try again.'
            });
          }
        }
      } catch (error) {
        console.error('Error in fetchFormData:', error);
      } finally {
        setIsLoading(false);
      }
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
      if (formData.image) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        
        selectedTags.forEach(tagId => {
          formDataToSend.append('tags[]', tagId);
        });
        
        formDataToSend.append('image', formData.image);
        
        let response;
        if (isEditMode) {
          response = await questionService.updateQuestion(id, formDataToSend);
        } else {
          response = await questionService.createQuestion(formDataToSend);
        }
        
        if (response && (response.message || response.data)) {
          const questionId = isEditMode ? id : (response.data ? response.data.id : null);
          if (questionId) {
            navigate(`/questions/${questionId}`);
          } else {
            console.error('No question ID found in response', response);
            setErrors({ general: 'Unexpected response from server' });
          }
        } else {
          console.error('Invalid response from server', response);
          setErrors({ general: 'Invalid response from server' });
        }
      } else {
        const jsonData = {
          title: formData.title,
          description: formData.description,
          tags: selectedTags.length > 0 ? selectedTags : [],
          image_id: null 
        };
        
        
        let response;
        if (isEditMode) {
          response = await questionService.updateQuestion(id, jsonData);
        } else {
          response = await questionService.createQuestion(jsonData);
        }
        
        if (response && (response.message || response.data)) {
          const questionId = isEditMode ? id : (response.data ? response.data.id : null);
          if (questionId) {
            navigate(`/questions/${questionId}`);
          } else {
            console.error('No question ID found in response', response);
            setErrors({ general: 'Unexpected response from server' });
          }
        } else {
          console.error('Invalid response from server', response);
          setErrors({ general: 'Invalid response from server' });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
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
        {isEditMode ? 'Edit Question' : 'Ask a Question'}
      </h1>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Question Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="What's your question? Be specific."
            
          />
          {errors.title && <div className="text-red-500 mt-1">{errors.title[0]}</div>}
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </span>
          <div className="flex flex-wrap gap-2 mb-2">
            {Array.isArray(tags) && tags.length > 0 ? (
              tags.map(tag => (
                <label key={tag.id} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                    value={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  <span className="text-gray-700">#{tag.name}</span>
                </label>
              ))
            ) : (
              <div className="text-gray-500 p-4 border border-dashed border-gray-300 rounded-md w-full text-center">
                No tags available. Reload the page or try again later.
              </div>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              Selected tags: {selectedTags.length}
            </div>
          )}
          {errors.tags && <div className="text-red-500 mt-1">{errors.tags[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image (Optional)
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
                onError={(e) => {
                  console.error('Preview image failed to load:', e);
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Preview+Not+Available';
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Question Details
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={12}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Provide details about your question. Include all the information someone would need to answer your question."
            
          />
          {errors.description && <div className="text-red-500 mt-1">{errors.description[0]}</div>}
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
                {isEditMode ? 'Updating...' : 'Posting...'}
              </span>
            ) : (
              isEditMode ? 'Update Question' : 'Post Question'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
