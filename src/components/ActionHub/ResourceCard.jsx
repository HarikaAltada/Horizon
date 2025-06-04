import React from 'react';
import { ExternalLink } from 'lucide-react';
import { passionCategories } from '../../data/PassionCategories';
import './ActionHubPage.css';

const ResourceCard = ({ resource }) => {
  return (
    <div className="resource-card group">
      <div className="resource-image-container">
        <img src={resource.imageUrl} alt={resource.name} className="resource-image" />
        <div className="resource-tag">
          <span className={`tag ${resource.type}`}>
            {resource.type === 'ngo' ? 'NGO' : resource.type === 'funding' ? 'Funding' : 'Learning'}
          </span>
        </div>
      </div>

      <div className="resource-content">
        <h3 className="resource-title">{resource.name}</h3>
        <p className="resource-description">{resource.description}</p>

        <div className="resource-categories">
          {resource.categories.slice(0, 3).map(categoryId => {
            const category = passionCategories[categoryId];
            return category ? (
              <span key={categoryId} className="category-chip">
                {category.name}
              </span>
            ) : null;
          })}
          {resource.categories.length > 3 && (
            <span className="category-chip">+{resource.categories.length - 3} more</span>
          )}
        </div>

        <a href={resource.websiteUrl} target="_blank" rel="noopener noreferrer" className="visit-link">
          Visit Website
          <ExternalLink className="external-link-icon" />
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
