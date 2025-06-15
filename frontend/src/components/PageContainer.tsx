import React, { useState } from 'react';

const placeholderImages = [
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
  'https://media.licdn.com/dms/image/v2/D4E03AQHgM8-b6YnEWA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720511882437?e=1755129600&v=beta&t=PORD_vegfkC7MhFf6qu2hSmz5xmEyRjZO_IwqBNEwZY',
];

const initialTextBlocks = [
  'Welcome to the Page block! This is a sample text block.',
  'You can add multiple text blocks here, each with its own content and style.',
  'The right area will soon display media in a scrollable column.'
];

const PageContainer: React.FC = () => {
  const [textBlocks, setTextBlocks] = useState(initialTextBlocks);

  return (
    <div style={{
      display: 'flex',
      width: '90vw',
      height: '90vh',
      margin: '40px auto',
      border: '1px solid #ffd246', // bright border
      borderRadius: '2rem',
      background: 'rgba(0, 0, 0, 0.65)',
      boxShadow: '0px 0px 6px 6px rgba(184, 129, 1, 0.10) 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden'
    }}>
      {/* Left: Text Area */}
      <div style={{
        flex: 8,
        borderRight: '1px solid #ffd246',
        height: '100%',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <h2 style={{ margin: 0, color: '#e27100', fontSize: '52px', fontWeight: 700, textAlign: 'center' }}>Text</h2>
        <div style={{
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #e27100 0%, #ffd246 100%)',
          borderRadius: '2px',
          margin: '1px 0px 18px 0px',
          opacity: 0.8
        }} />
        {textBlocks.map((text, idx) => (
          <div key={idx} style={{
            background: '#ffe6b3',
            borderRadius: '12px',
            padding: '16px',
            color: '#222',
            fontSize: '1.1rem',
          }}>
            {text}
          </div>
        ))}
      </div>
      {/* Right: Media Area */}
      <div style={{
        flex: 2,
        height: '100%',
        padding: '32px',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <h2 style={{ margin: 0, color: '#e27100', fontSize: '52px', fontWeight: 700 }}>Media</h2>
        <div style={{
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #e27100 0%, #ffd246 100%)',
          borderRadius: '2px',
          margin: '1px 0px 18px 0px',
          opacity: 0.8,
          gap: '24px',
        }} />
        <div style={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          alignItems: 'center',
          // Remove invalid border here since we'll add it to individual images
        }}>
          {placeholderImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`media-${idx}`}
              style={{
                width: '100%',
                borderRadius: '12px',
                border: '2px solid #ffd246',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(226,113,0,0.08)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;