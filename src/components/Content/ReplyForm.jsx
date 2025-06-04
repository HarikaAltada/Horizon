// // ReplyForm.jsx
// import React, { useState } from 'react';
// import './ReplyForm.css';

// const ReplyForm = ({ onSubmit, onCancel }) => {
//   const [message, setMessage] = useState('');
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const nameFromStorage = JSON.parse(localStorage.getItem("currentUser"))?.name;

//     const newErrors = {};
//     if (!nameFromStorage) newErrors.author = 'User not found';
//     if (!message.trim()) newErrors.message = 'Reply cannot be empty';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     onSubmit({ author: nameFromStorage, message });

//     setMessage('');
//     setErrors({});
//   };

//   return (
//     <form onSubmit={handleSubmit} className="reply-form">
//       <div>
//         <label>Message</label>
//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className={errors.message ? 'error' : ''}
//           placeholder="Write your reply..."
//         />
//         {errors.message && <p className="error-text">{errors.message}</p>}
//       </div>

//       {errors.author && <p className="error-text">{errors.author}</p>}

//       <div className="btn-group">
//         <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
//         <button type="submit" className="submit-btn">Submit Reply</button>
//       </div>
//     </form>
//   );
// };

// export default ReplyForm;


import React, { useState } from 'react';
import './ReplyForm.css';

const ReplyForm = ({ onSubmit, onCancel }) => {
 

   const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameFromStorage = JSON.parse(localStorage.getItem("currentUser"))?.name;

    const newErrors = {};
    if (!nameFromStorage) newErrors.author = 'User not found';
    if (!message.trim()) newErrors.message = 'Reply cannot be empty';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ author: nameFromStorage, message });

    setMessage('');
    setErrors({});
  };


  return (
    <form className="comment-box" onSubmit={handleSubmit}>
      <textarea
        placeholder="Add comment..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="comment-input"
      />
      {errors.message && <p className="error-text">{errors.message}</p>}
      {errors.author && <p className="error-text">{errors.author}</p>}

      <div className="toolbar">
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        <button type="submit" className="submit-button">Submit</button>
      </div>
    </form>
  );
};

export default ReplyForm;
