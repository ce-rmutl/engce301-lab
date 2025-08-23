# LAB-06: Low Level Design with React.js
## ระบบติดตาม Carbon Footprint - EcoTrack

**Course:** ENGCE301 - Software Design and Development  
**Week:** 6  
**Duration:** 1 สัปดาห์ (3 ชั่วโมงปฏิบัติการ)  
**Type:** กลุ่ม (3-4 คน) - ต่อเนื่องจาก LAB-05  

---

## 🎯 Learning Objectives

เมื่อจบ Lab นี้ นักศึกษาจะสามารถ:
1. **ออกแบบ** React Component Architecture โดยแยก Presentational และ Container Components
2. **ใช้หลักการ** Single Responsibility Principle ในการออกแบบ Components
3. **สร้าง** Reusable UI Components ที่มีคุณภาพและนำกลับมาใช้ได้
4. **กำหนด** Props Interface และ State Management Strategy
5. **ประยุกต์** Component Composition Patterns
6. **เขียน** Component Documentation และ Usage Examples

## 📋 Prerequisites

- ผลงานจาก LAB-05 (High-Level Architecture)
- ความรู้พื้นฐาน React.js (Components, Props, State)
- ความรู้ JavaScript ES6+ (Arrow Functions, Destructuring, Modules)
- Node.js และ npm ติดตั้งในเครื่อง

## 🛠️ Tools & Resources

- **Development:** Node.js 16+, VS Code, React DevTools
- **Starter:** Create React App template
- **UI Framework:** Material-UI หรือ Tailwind CSS (เลือก)
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Documentation:** Storybook (Optional, สำหรับ Bonus)

---

## 📚 Background Knowledge

### React Component Design Patterns

#### 1. Presentational vs Container Components

**Presentational Components (Dumb Components):**
- รับผิดชอบเฉพาะการแสดงผล UI
- รับข้อมูลผ่าน Props
- ไม่มี Internal State หรือมีน้อยมาก
- Reusable และ Testable

```jsx
// Presentational Component
const CarbonSummaryCard = ({ title, value, unit, trend, color }) => {
  return (
    <div className={`carbon-card ${color}`}>
      <h3>{title}</h3>
      <div className="value">
        {value} <span className="unit">{unit}</span>
      </div>
      <div className={`trend ${trend > 0 ? 'up' : 'down'}`}>
        {trend}%
      </div>
    </div>
  );
};
```

**Container Components (Smart Components):**
- จัดการ State และ Logic
- เชื่อมต่อกับ APIs หรือ External Services
- ส่งข้อมูลให้ Presentational Components
- Handle User Interactions

```jsx
// Container Component
const DashboardContainer = () => {
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarbonData()
      .then(data => {
        setCarbonData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <CarbonSummaryCard 
        title="Today's Footprint"
        value={carbonData.today}
        unit="kg CO2e"
        trend={carbonData.todayTrend}
        color="primary"
      />
      {/* More cards... */}
    </div>
  );
};
```

#### 2. Component Composition Patterns

**Compound Components:**
```jsx
const ActivityForm = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="activity-form">
      {children}
    </form>
  );
};

ActivityForm.Header = ({ title }) => (
  <div className="form-header">{title}</div>
);

ActivityForm.Field = ({ label, children }) => (
  <div className="form-field">
    <label>{label}</label>
    {children}
  </div>
);

ActivityForm.Actions = ({ children }) => (
  <div className="form-actions">{children}</div>
);
```

**Render Props Pattern:**
```jsx
const DataFetcher = ({ url, render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return render({ data, loading });
};

// Usage
<DataFetcher 
  url="/api/carbon/summary"
  render={({ data, loading }) => 
    loading ? <Spinner /> : <CarbonChart data={data} />
  }
/>
```

---

## 💻 Lab Activities

### Part 1: Component Architecture Analysis (45 นาติ)

#### Activity 1.1: Requirements to Components Mapping (20 นาที)

**เป้าหมาย:** แปลง High-Level Architecture เป็น React Components

**ขั้นตอน:**
1. **ทบทวน Frontend Components** จาก LAB-05
2. **แยกเป็น Presentational และ Container Components:**

```
EcoTrack React App
│
├── 🏠 Pages (Container Components)
│   ├── DashboardPage
│   ├── ActivityPage  
│   ├── ReportsPage
│   ├── ProfilePage
│   └── AdminPage
│
├── 📦 Containers (Smart Components)
│   ├── DashboardContainer
│   ├── ActivityFormContainer
│   ├── CarbonCalculatorContainer
│   ├── LeaderboardContainer
│   └── UserProfileContainer
│
├── 🎨 Components (Presentational)
│   ├── UI/
│   │   ├── Button
│   │   ├── Card
│   │   ├── Modal
│   │   ├── Input
│   │   └── Chart
│   ├── Layout/
│   │   ├── Header
│   │   ├── Sidebar
│   │   ├── Footer
│   │   └── Navigation
│   └── Domain/
│       ├── CarbonSummaryCard
│       ├── ActivityCard
│       ├── BadgeDisplay
│       ├── ProgressBar
│       └── EmissionChart
│
└── 🔧 Utilities
    ├── hooks/
    ├── services/
    ├── utils/
    └── constants/
```

3. **Component Responsibility Matrix:**

| Component | Type | Responsibilities | Props | State |
|-----------|------|------------------|-------|-------|
| `DashboardPage` | Container | Page routing, layout | - | navigation |
| `DashboardContainer` | Container | Data fetching, state management | - | data, loading |
| `CarbonSummaryCard` | Presentational | Display carbon data | title, value, trend | - |
| `ActivityFormContainer` | Container | Form logic, validation | onSubmit | formData, errors |
| `Button` | Presentational | Button UI | variant, size, onClick | - |

**Deliverable 1.1:** Component Architecture Tree Diagram

#### Activity 1.2: Props Interface Design (25 นาที)

**เป้าหมาย:** กำหนด Props Interface ที่ชัดเจนและ Type-safe

**ขั้นตอน:**
1. **สร้าง Props Specification** สำหรับ Core Components:

```jsx
// CarbonSummaryCard Props Interface
interface CarbonSummaryCardProps {
  title: string;
  value: number;
  unit: string;
  trend: number; // percentage change
  period: 'today' | 'week' | 'month';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  onClick?: () => void;
}

// ActivityForm Props Interface
interface ActivityFormProps {
  type: 'transport' | 'energy' | 'waste';
  initialData?: ActivityData;
  onSubmit: (data: ActivityData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

// Chart Component Props Interface
interface EmissionChartProps {
  data: ChartDataPoint[];
  type: 'pie' | 'bar' | 'line';
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  onDataPointClick?: (point: ChartDataPoint) => void;
}

// Button Props Interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'text';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}
```

2. **Props Validation Strategy:**
```jsx
import PropTypes from 'prop-types';

CarbonSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  trend: PropTypes.number,
  period: PropTypes.oneOf(['today', 'week', 'month']),
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  loading: PropTypes.bool,
  onClick: PropTypes.func
};
```

**Deliverable 1.2:** Props Interface Documentation (TypeScript interfaces หรือ PropTypes)

### Part 2: Reusable UI Components Implementation (90 นาที)

#### Activity 2.1: Core UI Components (45 นาที)

**เป้าหมาย:** สร้าง Basic UI Components ที่ Reusable

**ขั้นตอน:**
1. **Setup React Project:**
```bash
npx create-react-app ecotrack-components
cd ecotrack-components
npm install prop-types classnames
```

2. **สร้าง Button Component:**
```jsx
// src/components/ui/Button/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.css';

const Button = ({ 
  variant = 'primary',
  size = 'medium', 
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  children,
  ...props 
}) => {
  const buttonClass = classNames(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    {
      'btn--loading': loading,
      'btn--disabled': disabled,
      'btn--full-width': fullWidth
    }
  );

  return (
    <button 
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      {!loading && startIcon && <span className="btn__start-icon">{startIcon}</span>}
      <span className="btn__text">{children}</span>
      {!loading && endIcon && <span className="btn__end-icon">{endIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default Button;
```

3. **สร้าง Button CSS:**
```css
/* src/components/ui/Button/Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

/* Sizes */
.btn--small {
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
}

.btn--medium {
  padding: 8px 16px;
  font-size: 16px;
  line-height: 24px;
}

.btn--large {
  padding: 12px 20px;
  font-size: 18px;
  line-height: 28px;
}

/* Variants */
.btn--primary {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn--primary:hover {
  background-color: #059669;
  border-color: #059669;
}

.btn--secondary {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn--outline {
  background-color: transparent;
  color: #10b981;
  border-color: #10b981;
}

/* States */
.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--loading {
  pointer-events: none;
}

.btn--full-width {
  width: 100%;
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

4. **สร้าง Card Component:**
```jsx
// src/components/ui/Card/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Card.css';

const Card = ({ 
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  loading = false,
  header,
  footer,
  children,
  onClick,
  ...props 
}) => {
  const cardClass = classNames(
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    {
      'card--hoverable': hoverable,
      'card--clickable': clickable,
      'card--loading': loading
    }
  );

  return (
    <div 
      className={cardClass}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {loading && <div className="card__loading-overlay" />}
      
      {header && (
        <div className="card__header">
          {header}
        </div>
      )}
      
      <div className="card__body">
        {children}
      </div>
      
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  loading: PropTypes.bool,
  header: PropTypes.node,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default Card;
```

5. **สร้าง Input Component:**
```jsx
// src/components/ui/Input/Input.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Input.css';

const Input = forwardRef(({ 
  label,
  type = 'text',
  size = 'medium',
  variant = 'default',
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  startAdornment,
  endAdornment,
  ...props 
}, ref) => {
  const inputClass = classNames(
    'input',
    `input--${size}`,
    `input--${variant}`,
    {
      'input--error': !!error,
      'input--disabled': disabled,
      'input--full-width': fullWidth,
      'input--with-start-adornment': !!startAdornment,
      'input--with-end-adornment': !!endAdornment
    }
  );

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container">
        {startAdornment && (
          <div className="input__start-adornment">
            {startAdornment}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClass}
          disabled={disabled}
          {...props}
        />
        
        {endAdornment && (
          <div className="input__end-adornment">
            {endAdornment}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`input__helper ${error ? 'input__helper--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'outlined', 'filled']),
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node
};

export default Input;
```

**Deliverable 2.1:** Basic UI Components (Button, Card, Input) with CSS

#### Activity 2.2: Domain-Specific Components (45 นาที)

**เป้าหมาย:** สร้าง Components เฉพาะสำหรับ EcoTrack

**ขั้นตอน:**
1. **CarbonSummaryCard Component:**
```jsx
// src/components/domain/CarbonSummaryCard/CarbonSummaryCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../ui/Card/Card';
import './CarbonSummaryCard.css';

const CarbonSummaryCard = ({ 
  title,
  value,
  unit,
  trend,
  period,
  color = 'primary',
  loading = false,
  onClick 
}) => {
  const formatValue = (val) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'k';
    }
    return val.toFixed(1);
  };

  const formatTrend = (trendValue) => {
    if (trendValue === 0) return 'No change';
    const direction = trendValue > 0 ? '↑' : '↓';
    return `${direction} ${Math.abs(trendValue)}%`;
  };

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'trend-up'; // Bad for carbon
    if (trendValue < 0) return 'trend-down'; // Good for carbon
    return 'trend-neutral';
  };

  return (
    <Card
      variant="elevated"
      hoverable={!!onClick}
      clickable={!!onClick}
      loading={loading}
      onClick={onClick}
      className={`carbon-summary-card carbon-summary-card--${color}`}
    >
      <div className="carbon-summary-card__header">
        <h3 className="carbon-summary-card__title">{title}</h3>
        <span className="carbon-summary-card__period">{period}</span>
      </div>
      
      <div className="carbon-summary-card__value">
        <span className="value__number">{formatValue(value)}</span>
        <span className="value__unit">{unit}</span>
      </div>
      
      {trend !== undefined && (
        <div className={`carbon-summary-card__trend ${getTrendColor(trend)}`}>
          {formatTrend(trend)}
        </div>
      )}
    </Card>
  );
};

CarbonSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  trend: PropTypes.number,
  period: PropTypes.oneOf(['today', 'week', 'month', 'year']),
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  loading: PropTypes.bool,
  onClick: PropTypes.func
};

export default CarbonSummaryCard;
```

2. **ActivityCard Component:**
```jsx
// src/components/domain/ActivityCard/ActivityCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import './ActivityCard.css';

const ActivityCard = ({ 
  activity,
  showActions = true,
  onEdit,
  onDelete,
  onClick 
}) => {
  const getActivityIcon = (type) => {
    const icons = {
      transport: '🚗',
      energy: '⚡',
      waste: '♻️'
    };
    return icons[type] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card
      variant="outlined"
      hoverable={!!onClick}
      clickable={!!onClick}
      onClick={onClick}
      className="activity-card"
    >
      <div className="activity-card__header">
        <div className="activity-card__icon">
          {getActivityIcon(activity.type)}
        </div>
        <div className="activity-card__info">
          <h4 className="activity-card__title">{activity.title}</h4>
          <p className="activity-card__date">{formatDate(activity.date)}</p>
        </div>
        <div className="activity-card__emissions">
          <span className="emissions__value">{activity.co2e}</span>
          <span className="emissions__unit">kg CO2e</span>
        </div>
      </div>
      
      <div className="activity-card__details">
        <p>{activity.description}</p>
        {activity.distance && (
          <div className="detail-item">
            <span className="detail-label">Distance:</span>
            <span className="detail-value">{activity.distance} km</span>
          </div>
        )}
        {activity.points && (
          <div className="activity-card__points">
            +{activity.points} points
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="activity-card__actions">
          <Button 
            variant="text" 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(activity);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="text" 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(activity);
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['transport', 'energy', 'waste']).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    co2e: PropTypes.number.isRequired,
    distance: PropTypes.number,
    points: PropTypes.number
  }).isRequired,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func
};

export default ActivityCard;
```

3. **ProgressBar Component:**
```jsx
// src/components/domain/ProgressBar/ProgressBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = ({ 
  value,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'medium',
  animated = false 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColorClass = () => {
    if (percentage >= 90) return 'progress-bar--danger';
    if (percentage >= 70) return 'progress-bar--warning';
    return `progress-bar--${color}`;
  };

  return (
    <div className={`progress-bar progress-bar--${size}`}>
      {label && (
        <div className="progress-bar__header">
          <span className="progress-bar__label">{label}</span>
          {showValue && (
            <span className="progress-bar__value">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className="progress-bar__track">
        <div 
          className={`progress-bar__fill ${getColorClass()} ${animated ? 'progress-bar__fill--animated' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {showValue && !label && (
            <span className="progress-bar__percentage">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  animated: PropTypes.bool
};

export default ProgressBar;
```

**Deliverable 2.2:** Domain-specific Components พร้อม CSS

### Part 3: Container Components & State Management (60 นาที)

#### Activity 3.1: Dashboard Container (30 นาที)

**เป้าหมาย:** สร้าง Container Component ที่จัดการ State และ Data Fetching

```jsx
// src/containers/DashboardContainer/DashboardContainer.jsx
import React, { useState, useEffect } from 'react';
import CarbonSummaryCard from '../../components/domain/CarbonSummaryCard/CarbonSummaryCard';
import ActivityCard from '../../components/domain/ActivityCard/ActivityCard';
import ProgressBar from '../../components/domain/ProgressBar/ProgressBar';
import './DashboardContainer.css';

// Mock API service
const dashboardService = {
  async fetchDashboardData() {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          carbonSummary: {
            today: 2.5,
            week: 18.3,
            month: 75.2,
            todayTrend: -12,
            weekTrend: 5,
            monthTrend: -8
          },
          recentActivities: [
            {
              id: '1',
              type: 'transport',
              title: 'BTS to University',
              description: 'Saphan Phong to Mo Chit - 15 km',
              date: '2024-03-15',
              co2e: 0.3,
              distance: 15,
              points: 25
            },
            {
              id: '2',
              type: 'energy',
              title: 'Monthly Electricity',
              description: 'Dorm electricity usage',
              date: '2024-03-14',
              co2e: 45.2,
              points: 10
            }
          ],
          goals: {
            monthly: { current: 75.2, target: 100, label: 'Monthly CO2e Goal' },
            points: { current: 1250, target: 1500, label: 'Monthly Points' }
          }
        });
      }, 1000);
    });
  }
};

const DashboardContainer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardService.fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityEdit = (activity) => {
    console.log('Edit activity:', activity);
    // Implementation for edit functionality
  };

  const handleActivityDelete = (activity) => {
    console.log('Delete activity:', activity);
    // Implementation for delete functionality
  };

  const handleCardClick = (cardType) => {
    console.log('Card clicked:', cardType);
    // Navigate to detailed view
  };

  if (loading) {
    return (
      <div className="dashboard-container dashboard-container--loading">
        <div className="loading-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="loading-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container dashboard-container--error">
        <div className="error-message">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard-container">
      {/* Carbon Summary Section */}
      <section className="dashboard-section">
        <h2 className="dashboard-section__title">Carbon Footprint Summary</h2>
        <div className="carbon-summary-grid">
          <CarbonSummaryCard
            title="Today"
            value={data.carbonSummary.today}
            unit="kg CO2e"
            trend={data.carbonSummary.todayTrend}
            period="today"
            color="primary"
            onClick={() => handleCardClick('today')}
          />
          <CarbonSummaryCard
            title="This Week"
            value={data.carbonSummary.week}
            unit="kg CO2e"
            trend={data.carbonSummary.weekTrend}
            period="week"
            color="success"
            onClick={() => handleCardClick('week')}
          />
          <CarbonSummaryCard
            title="This Month"
            value={data.carbonSummary.month}
            unit="kg CO2e"
            trend={data.carbonSummary.monthTrend}
            period="month"
            color="warning"
            onClick={() => handleCardClick('month')}
          />
        </div>
      </section>

      {/* Goals Progress Section */}
      <section className="dashboard-section">
        <h2 className="dashboard-section__title">Goals Progress</h2>
        <div className="goals-grid">
          <ProgressBar
            value={data.goals.monthly.current}
            max={data.goals.monthly.target}
            label={data.goals.monthly.label}
            color="success"
            animated
          />
          <ProgressBar
            value={data.goals.points.current}
            max={data.goals.points.target}
            label={data.goals.points.label}
            color="primary"
            animated
          />
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="dashboard-section">
        <h2 className="dashboard-section__title">Recent Activities</h2>
        <div className="activities-list">
          {data.recentActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={handleActivityEdit}
              onDelete={handleActivityDelete}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardContainer;
```

**Deliverable 3.1:** Dashboard Container Component

#### Activity 3.2: Custom Hooks (30 นาที)

**เป้าหมาย:** สร้าง Custom Hooks สำหรับ Reusable Logic

```jsx
// src/hooks/useCarbonData.js
import { useState, useEffect } from 'react';

export const useCarbonData = (period = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock API call
        const response = await fetch(`/api/carbon/summary?period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch carbon data');
        
        const carbonData = await response.json();
        
        if (!isCancelled) {
          setData(carbonData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [period]);

  const refresh = () => {
    setData(null);
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refresh };
};

// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// src/hooks/useForm.js
import { useState, useCallback } from 'react';

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message || `${name} is required`;
    }

    if (rule.min && value < rule.min) {
      return rule.message || `${name} must be at least ${rule.min}`;
    }

    if (rule.max && value > rule.max) {
      return rule.message || `${name} must be no more than ${rule.max}`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} format is invalid`;
    }

    if (rule.custom) {
      return rule.custom(value, values) || '';
    }

    return '';
  }, [validationRules, values]);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).every(key => !errors[key])
  };
};
```

**Deliverable 3.2:** Custom Hooks สำหรับ Data Fetching, Form Management, และ Local Storage

---

## 📤 Deliverables

### ไฟล์ที่ต้องส่ง:

1. **Component_Architecture_Tree.png**
   - Component hierarchy และ responsibilities mapping

2. **Props_Interface_Documentation.md**
   - TypeScript interfaces หรือ PropTypes สำหรับทุก components

3. **UI_Components/** (โฟลเดอร์)
   ```
   UI_Components/
   ├── Button/
   │   ├── Button.jsx
   │   ├── Button.css
   │   └── Button.stories.js (optional)
   ├── Card/
   │   ├── Card.jsx
   │   ├── Card.css
   │   └── Card.stories.js (optional)
   ├── Input/
   │   ├── Input.jsx
   │   ├── Input.css
   │   └── Input.stories.js (optional)
   └── index.js (export all components)
   ```

4. **Domain_Components/** (โฟลเดอร์)
   ```
   Domain_Components/
   ├── CarbonSummaryCard/
   ├── ActivityCard/
   ├── ProgressBar/
   └── index.js
   ```

5. **Container_Components/** (โฟลเดอร์)
   ```
   Container_Components/
   ├── DashboardContainer/
   │   ├── DashboardContainer.jsx
   │   ├── DashboardContainer.css
   │   └── DashboardContainer.test.js (optional)
   └── index.js
   ```

6. **Custom_Hooks/** (โฟลเดอร์)
   ```
   Custom_Hooks/
   ├── useCarbonData.js
   ├── useLocalStorage.js
   ├── useForm.js
   └── index.js
   ```

7. **Component_Usage_Guide.md**
   - การใช้งาน components พร้อมตัวอย่าง code

8. **Demo_App/** (โฟลเดอร์)
   - Create React App ที่รวม components ทั้งหมด
   - แสดงการใช้งานจริง

### การส่งงาน:
- **สร้างโฟลเดอร์:** `LAB06_ComponentDesign_GroupX`
- **อัพโหลดใน Google Drive** ตาม link ที่แจก
- **Include:** README.md พร้อมวิธี run demo app
- **Deadline:** วันศุกร์ สัปดาห์ที่ 6 เวลา 23:59 น.

---

## 🏆 Grading Rubric (100 คะแนน)

| หัวข้อ | คะแนน | เกณฑ์การให้คะแนน |
|--------|-------|------------------|
| **Component Architecture** | 20 | ถูกหลัก Separation of Concerns (16-20), มีการแยก แต่ไม่ชัดเจน (10-15), ไม่แยกหรือผิด (0-9) |
| **UI Components Quality** | 25 | Reusable, Props design ดี, มี PropTypes (20-25), ใช้งานได้แต่ไม่ flexible (15-19), มีปัญหาการใช้งาน (0-14) |
| **Domain Components** | 20 | เหมาะกับ business logic, UI ดี (16-20), ทำงานได้แต่ design ไม่ดี (10-15), ไม่ทำงาน (0-9) |
| **Container Components** | 20 | จัดการ state ดี, separation ชัดเจน (16-20), ทำงานได้แต่ logic ไม่ดี (10-15), มีปัญหา (0-9) |
| **Custom Hooks** | 10 | Reusable logic ดี, clean code (8-10), ทำงานได้แต่ไม่ reusable (5-7), มีปัญหา (0-4) |
| **Documentation & Demo** | 5 | ครบถ้วน ชัดเจน (4-5), ขาดบางส่วน (2-3), ไม่มีหรือไม่ชัดเจน (0-1) |

**Bonus Points:**
- **+5:** Implement Storybook for component documentation
- **+3:** Add unit tests สำหรับ components
- **+2:** Implement TypeScript instead of PropTypes
- **+2:** Responsive design ที่ดี
- **+3:** Animation และ micro-interactions

**Penalty:**
- **-10:** Code ไม่รันได้หรือมี error มาก
- **-5:** ไม่ follow naming conventions หรือ file structure

---

## 🎯 Expected Learning Outcomes

เมื่อจบ LAB-06 นักศึกษาจะมี:

### Technical Skills:
- ✅ เข้าใจ Component-based architecture
- ✅ สามารถแยก Presentational และ Container components
- ✅ เขียน Reusable UI components ได้
- ✅ ใช้ Custom Hooks สำหรับ logic sharing
- ✅ Design Props interface ที่ดี

### Soft Skills:
- ✅ วางแผนและออกแบบก่อนเขียน code
- ✅ ทำงานเป็นทีมในการพัฒนา components
- ✅ เขียน documentation ที่ชัดเจน
- ✅ คิดในมุมมองของ maintainability

### Business Understanding:
- ✅ แปลง business requirements เป็น UI components
- ✅ เข้าใจ user experience ใน domain ของ EcoTrack
- ✅ ออกแบบ interface ที่ใช้งานง่าย

---

## 🔗 Resources & References

**React Best Practices:**
- [React Component Patterns](https://reactpatterns.com/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
- [Component Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)

**Design Systems:**
- [Material Design Components](https://material.io/components)
- [Ant Design](https://ant.design/components/overview/)
- [Chakra UI](https://chakra-ui.com/)

**Tools:**
- [Storybook](https://storybook.js.org/) - Component development environment
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [PropTypes Documentation](https://www.npmjs.com/package/prop-types)

**Testing:**
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/docs/getting-started)

**CSS Methodologies:**
- [BEM (Block Element Modifier)](https://getbem.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Styled Components](https://styled-components.com/)

---

## 🤝 Team Work Guidelines

**การแบ่งงาน (แนะนำ):**
- **คน A:** UI Components (Button, Card, Input) + Documentation
- **คน B:** Domain Components (CarbonSummaryCard, ActivityCard, ProgressBar)  
- **คน C:** Container Components (DashboardContainer) + State Management
- **คน D:** Custom Hooks + Demo App + Integration

**Best Practices:**
- **Code Review:** ทุกคนต้องรีวิวโค้ดของกันและกัน
- **Naming Conventions:** ใช้ camelCase สำหรับ variables, PascalCase สำหรับ Components
- **File Structure:** ตามโครงสร้างที่กำหนด
- **CSS:** ใช้ BEM methodology หรือ CSS Modules
- **Git:** ใช้ meaningful commit messages

**Daily Standups:**
- วันจันทร์: Planning และแบ่งงาน
- วันพุธ: Progress check และ integration
- วันศุกร์: Final review และส่งงาน

**Communication:**
- ใช้ Discord/Line สำหรับ daily communication
- Google Drive สำหรับ share files
- VS Code Live Share สำหรับ pair programming

---

## 📋 Pre-submission Checklist

### Code Quality:
- [ ] ทุก component มี PropTypes หรือ TypeScript interfaces
- [ ] CSS organized และใช้ consistent naming
- [ ] ไม่มี console.log ใน production code
- [ ] Error handling ครอบคลุม

### Functionality:
- [ ] ทุก component render ได้โดยไม่ error
- [ ] Props ทำงานตามที่ออกแบบ
- [ ] Responsive design ใช้งานได้บน mobile
- [ ] Custom hooks return expected values

### Documentation:
- [ ] README.md มีคำแนะนำการ run
- [ ] Component usage examples ชัดเจน
- [ ] Props interface documented
- [ ] File structure organized

### Teamwork:
- [ ] ทุกคนมีส่วนร่วมใน code
- [ ] Git history แสดงการทำงานของทุกคน
- [ ] Code style consistent ทั่วทั้งโปรเจกต์

---

## 🔮 Looking Ahead: Next Labs

**LAB-07:** จะใช้ components ที่สร้างในสัปดาห์นี้มา integrate กับ:
- Modern JavaScript ES6+ features
- API integration
- Real data fetching
- Advanced state management

**LAB-08:** จะเพิ่ม:
- React Router สำหรับ navigation
- Context API สำหรับ global state
- Form validation และ submission
- Performance optimization

**Final Project:** components เหล่านี้จะเป็น foundation สำหรับ EcoTrack application ที่สมบูรณ์

---

**Ready to build beautiful, reusable React components? Let's create! ⚛️🎨**

*Remember: Good component design today = easier development tomorrow!*

--------------------------------------------


# 🔧 LAB-06 เพิ่มเติม/แก้ไข

## เพิ่ม: Form Components สำหรับ Activity Logging

```jsx
// เพิ่มใน Activity 2.2: ActivityFormComponents

// src/components/domain/ActivityForm/TransportForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../../hooks/useForm';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import './TransportForm.css';

const TRANSPORT_TYPES = [
  { value: 'walking', label: 'Walking 🚶‍♂️', co2Factor: 0 },
  { value: 'bicycle', label: 'Bicycle 🚲', co2Factor: 0 },
  { value: 'motorcycle', label: 'Motorcycle 🏍️', co2Factor: 0.11 },
  { value: 'car_personal', label: 'Personal Car 🚗', co2Factor: 0.21 },
  { value: 'car_shared', label: 'Shared Car 🚗', co2Factor: 0.05 },
  { value: 'bus', label: 'Bus 🚌', co2Factor: 0.04 },
  { value: 'bts_mrt', label: 'BTS/MRT 🚇', co2Factor: 0.02 },
  { value: 'taxi', label: 'Taxi 🚕', co2Factor: 0.25 },
  { value: 'plane', label: 'Airplane ✈️', co2Factor: 0.255 }
];

const TransportForm = ({ onSubmit, onCancel, loading = false, initialData = null }) => {
  const validationRules = {
    transport_type: {
      required: true,
      message: 'Please select transportation type'
    },
    distance: {
      required: true,
      min: 0.1,
      max: 1000,
      message: 'Distance must be between 0.1 and 1000 km'
    },
    purpose: {
      required: true,
      message: 'Please specify the purpose of travel'
    },
    date: {
      required: true,
      custom: (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        if (selectedDate > today) {
          return 'Date cannot be in the future';
        }
        if (selectedDate < thirtyDaysAgo) {
          return 'Date cannot be more than 30 days ago';
        }
        return '';
      }
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset
  } = useForm(initialData || {
    transport_type: '',
    distance: '',
    purpose: 'work_study',
    route_from: '',
    route_to: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  }, validationRules);

  const calculateCO2 = () => {
    const transportType = TRANSPORT_TYPES.find(t => t.value === values.transport_type);
    if (!transportType || !values.distance) return 0;
    
    return (parseFloat(values.distance) * transportType.co2Factor).toFixed(2);
  };

  const calculatePoints = () => {
    const co2 = parseFloat(calculateCO2());
    const transportType = TRANSPORT_TYPES.find(t => t.value === values.transport_type);
    
    if (!transportType) return 0;
    
    // Award more points for eco-friendly transport
    if (transportType.co2Factor === 0) return 50; // Walking, cycling
    if (transportType.co2Factor <= 0.05) return 30; // Public transport, shared car
    if (transportType.co2Factor <= 0.15) return 20; // Efficient transport
    return 10; // Less efficient transport
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    const activityData = {
      ...values,
      distance: parseFloat(values.distance),
      co2e_calculated: parseFloat(calculateCO2()),
      points_earned: calculatePoints(),
      type: 'transport'
    };

    try {
      await onSubmit(activityData);
      reset();
    } catch (error) {
      console.error('Failed to submit transport activity:', error);
    }
  };

  return (
    <Card className="transport-form" padding="large">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>🚗 Transportation Activity</h3>
          <p>Record your daily transportation to track carbon footprint</p>
        </div>

        <div className="form-grid">
          {/* Transport Type Selection */}
          <div className="form-field">
            <label className="form-label">
              Transportation Type *
            </label>
            <select
              className={`form-select ${errors.transport_type && touched.transport_type ? 'form-select--error' : ''}`}
              value={values.transport_type}
              onChange={(e) => handleChange('transport_type', e.target.value)}
              onBlur={() => handleBlur('transport_type')}
            >
              <option value="">Select transportation...</option>
              {TRANSPORT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.transport_type && touched.transport_type && (
              <span className="form-error">{errors.transport_type}</span>
            )}
          </div>

          {/* Distance Input */}
          <Input
            label="Distance *"
            type="number"
            step="0.1"
            min="0"
            placeholder="15.5"
            value={values.distance}
            onChange={(e) => handleChange('distance', e.target.value)}
            onBlur={() => handleBlur('distance')}
            error={touched.distance ? errors.distance : ''}
            endAdornment={<span>km</span>}
            fullWidth
          />

          {/* Route Information */}
          <Input
            label="From"
            placeholder="Starting location"
            value={values.route_from}
            onChange={(e) => handleChange('route_from', e.target.value)}
            fullWidth
          />

          <Input
            label="To"
            placeholder="Destination"
            value={values.route_to}
            onChange={(e) => handleChange('route_to', e.target.value)}
            fullWidth
          />

          {/* Purpose Selection */}
          <div className="form-field">
            <label className="form-label">Purpose *</label>
            <select
              className={`form-select ${errors.purpose && touched.purpose ? 'form-select--error' : ''}`}
              value={values.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              onBlur={() => handleBlur('purpose')}
            >
              <option value="work_study">Work/Study</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="leisure">Leisure</option>
            </select>
            {errors.purpose && touched.purpose && (
              <span className="form-error">{errors.purpose}</span>
            )}
          </div>

          {/* Date Input */}
          <Input
            label="Date *"
            type="date"
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            error={touched.date ? errors.date : ''}
            fullWidth
          />

          {/* Notes */}
          <div className="form-field form-field--full-width">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Additional notes about this trip..."
              value={values.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows="3"
            />
          </div>
        </div>

        {/* Calculation Preview */}
        {values.transport_type && values.distance && (
          <div className="calculation-preview">
            <div className="calculation-item">
              <span className="calculation-label">CO2 Emissions:</span>
              <span className="calculation-value co2-value">
                {calculateCO2()} kg CO2e
              </span>
            </div>
            <div className="calculation-item">
              <span className="calculation-label">Points Earned:</span>
              <span className="calculation-value points-value">
                +{calculatePoints()} points
              </span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {initialData ? 'Update Activity' : 'Record Activity'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

TransportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  initialData: PropTypes.object
};

export default TransportForm;
```

## เพิ่ม: CSS สำหรับ TransportForm

```css
/* src/components/domain/ActivityForm/TransportForm.css */
.transport-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h3 {
  margin: 0 0 0.5rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field--full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-select--error {
  border-color: #ef4444;
}

.form-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.calculation-preview {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid #10b981;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.calculation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.calculation-item:last-child {
  margin-bottom: 0;
}

.calculation-label {
  font-weight: 500;
  color: #374151;
}

.calculation-value {
  font-weight: 600;
  font-size: 1.125rem;
}

.co2-value {
  color: #059669;
}

.points-value {
  color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}

/* Focus States */
.form-select:focus,
.form-textarea:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Error States */
.form-select--error,
.form-textarea--error {
  border-color: #ef4444;
}

.form-select--error:focus,
.form-textarea--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Loading State */
.transport-form--loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Success Animation */
@keyframes success-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.calculation-preview--success {
  animation: success-pulse 0.3s ease;
}
```

## เพิ่ม: Error Boundary Component

```jsx
// src/components/common/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div className="error-boundary">
          <Card variant="outlined" className="error-boundary__card">
            <div className="error-boundary__content">
              <div className="error-boundary__icon">⚠️</div>
              <h2 className="error-boundary__title">Oops! Something went wrong</h2>
              <p className="error-boundary__message">
                {this.props.message || 'An unexpected error occurred. Please try again.'}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-boundary__details">
                  <summary>Error Details (Development Only)</summary>
                  <pre className="error-boundary__error">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="error-boundary__actions">
                <Button 
                  variant="primary" 
                  onClick={this.handleRetry}
                >
                  Try Again
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  message: PropTypes.string,
  onError: PropTypes.func
};

export default ErrorBoundary;

// Usage Example:
// <ErrorBoundary message="Failed to load dashboard">
//   <DashboardContainer />
// </ErrorBoundary>
```

## เพิ่ม: Realistic Mock API Service

```javascript
// src/services/mockApiService.js
/**
 * Realistic Mock API Service for EcoTrack
 * Simulates real API responses with proper delays and error handling
 */

// Mock database
let mockDatabase = {
  users: {
    'user_123': {
      id: 'user_123',
      email: 'student@university.ac.th',
      name: 'John Doe',
      faculty: 'Engineering',
      year: 3,
      created_at: '2024-01-15T00:00:00Z'
    }
  },
  activities: {
    'act_1': {
      id: 'act_1',
      user_id: 'user_123',
      type: 'transport',
      sub_type: 'bts',
      title: 'BTS to University',
      description: 'Daily commute using BTS',
      date: '2024-03-15',
      distance: 15.5,
      co2e_calculated: 0.31,
      points_earned: 25,
      created_at: '2024-03-15T08:30:00Z'
    },
    'act_2': {
      id: 'act_2',
      user_id: 'user_123',
      type: 'energy',
      sub_type: 'electricity',
      title: 'Monthly Electricity',
      description: 'Dorm electricity usage',
      date: '2024-03-14',
      amount: 150,
      unit: 'kWh',
      co2e_calculated: 84.15,
      points_earned: 10,
      created_at: '2024-03-14T20:00:00Z'
    }
  },
  carbonSummary: {
    'user_123': {
      today: 2.5,
      week: 18.3,
      month: 75.2,
      year: 892.4,
      trends: {
        todayTrend: -12,
        weekTrend: 5,
        monthTrend: -8,
        yearTrend: -15
      }
    }
  }
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const paginate = (data, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const items = data.slice(offset, offset + limit);
  
  return {
    data: items,
    meta: {
      page: parseInt(page),
      per_page: parseInt(limit),
      total: data.length,
      total_pages: Math.ceil(data.length / limit)
    }
  };
};

// Mock API Service
class MockApiService {
  constructor() {
    this.currentUser = 'user_123';
    this.requestDelay = 800; // Simulate network delay
  }

  // Simulate network errors randomly
  shouldSimulateError() {
    return Math.random() < 0.05; // 5% chance of error
  }

  async request(endpoint, options = {}) {
    console.log(`🔄 Mock API: ${options.method || 'GET'} ${endpoint}`);
    
    // Simulate network delay
    await delay(this.requestDelay);

    // Simulate random errors
    if (this.shouldSimulateError() && !endpoint.includes('retry')) {
      throw new Error('Network error: Unable to connect to server');
    }

    return { endpoint, options };
  }

  // Authentication
  async login(credentials) {
    await this.request('/auth/login', { method: 'POST', body: credentials });
    
    return {
      status: 'success',
      data: {
        access_token: 'mock_jwt_token_' + generateId(),
        refresh_token: 'mock_refresh_token_' + generateId(),
        expires_in: 3600,
        user: mockDatabase.users[this.currentUser]
      }
    };
  }

  // Activities
  async getActivities({ page = 1, limit = 20, type = null, date_from = null }) {
    await this.request('/activities');
    
    let activities = Object.values(mockDatabase.activities)
      .filter(activity => activity.user_id === this.currentUser);
    
    if (type) {
      activities = activities.filter(activity => activity.type === type);
    }
    
    if (date_from) {
      activities = activities.filter(activity => activity.date >= date_from);
    }

    // Sort by date descending
    activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      status: 'success',
      ...paginate(activities, page, limit)
    };
  }

  async createActivity(activityData) {
    await this.request('/activities', { method: 'POST', body: activityData });
    
    const id = 'act_' + generateId();
    const newActivity = {
      id,
      user_id: this.currentUser,
      ...activityData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockDatabase.activities[id] = newActivity;
    
    // Update carbon summary
    this.updateCarbonSummary(newActivity.co2e_calculated);
    
    return {
      status: 'success',
      data: newActivity
    };
  }

  async updateActivity(id, activityData) {
    await this.request(`/activities/${id}`, { method: 'PUT', body: activityData });
    
    if (!mockDatabase.activities[id]) {
      throw new Error('Activity not found');
    }
    
    const oldCO2 = mockDatabase.activities[id].co2e_calculated;
    
    mockDatabase.activities[id] = {
      ...mockDatabase.activities[id],
      ...activityData,
      updated_at: new Date().toISOString()
    };
    
    // Update carbon summary
    const co2Difference = activityData.co2e_calculated - oldCO2;
    this.updateCarbonSummary(co2Difference);
    
    return {
      status: 'success',
      data: mockDatabase.activities[id]
    };
  }

  async deleteActivity(id) {
    await this.request(`/activities/${id}`, { method: 'DELETE' });
    
    if (!mockDatabase.activities[id]) {
      throw new Error('Activity not found');
    }
    
    const activity = mockDatabase.activities[id];
    
    // Update carbon summary (subtract the CO2)
    this.updateCarbonSummary(-activity.co2e_calculated);
    
    delete mockDatabase.activities[id];
    
    return {
      status: 'success',
      data: { message: 'Activity deleted successfully' }
    };
  }

  // Carbon Footprint
  async getCarbonFootprint(period = 'month', year = 2024) {
    await this.request(`/carbon/footprint?period=${period}&year=${year}`);
    
    const summary = mockDatabase.carbonSummary[this.currentUser];
    
    return {
      status: 'success',
      data: {
        period,
        year,
        total_co2e: summary[period],
        breakdown: {
          transport: summary[period] * 0.6,
          energy: summary[period] * 0.3,
          waste: summary[period] * 0.1
        },
        trend: summary.trends[`${period}Trend`],
        comparison: {
          previous_period: summary[period] * 1.12,
          faculty_average: summary[period] * 0.88,
          university_average: summary[period] * 0.95
        }
      }
    };
  }

  async getDashboardData() {
    await this.request('/dashboard');
    
    const summary = mockDatabase.carbonSummary[this.currentUser];
    const recentActivities = Object.values(mockDatabase.activities)
      .filter(activity => activity.user_id === this.currentUser)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    return {
      status: 'success',
      data: {
        carbonSummary: {
          today: summary.today,
          week: summary.week,
          month: summary.month,
          todayTrend: summary.trends.todayTrend,
          weekTrend: summary.trends.weekTrend,
          monthTrend: summary.trends.monthTrend
        },
        recentActivities,
        goals: {
          monthly: { 
            current: summary.month, 
            target: 100, 
            label: 'Monthly CO2e Goal (kg)' 
          },
          points: { 
            current: 1250, 
            target: 1500, 
            label: 'Monthly Points Goal' 
          }
        },
        badges: [
          {
            id: 'eco_starter',
            name: 'Eco Starter',
            description: '7 days of activity logging',
            earned: true,
            earned_at: '2024-03-10T00:00:00Z'
          },
          {
            id: 'green_commuter',
            name: 'Green Commuter',
            description: 'Use public transport 20 times',
            earned: false,
            progress: 15,
            target: 20
          }
        ],
        stats: {
          total_activities: Object.keys(mockDatabase.activities).length,
          days_active: 15,
          current_streak: 5,
          total_points: 1250,
          rank: {
            university: 142,
            faculty: 23
          }
        }
      }
    };
  }

  // Gamification
  async getLeaderboard(scope = 'faculty', limit = 100) {
    await this.request(`/gamification/leaderboard?scope=${scope}&limit=${limit}`);
    
    // Generate mock leaderboard data
    const leaderboardData = Array.from({ length: limit }, (_, index) => ({
      rank: index + 1,
      user_id: `user_${index + 1}`,
      display_name: `User ${index + 1}`, // Anonymized
      faculty: scope === 'faculty' ? 'Engineering' : `Faculty ${(index % 10) + 1}`,
      points: Math.max(2000 - (index * 15) + Math.random() * 50, 0),
      co2_saved: Math.max(100 - (index * 2) + Math.random() * 10, 0),
      activities_count: Math.max(50 - index + Math.random() * 20, 1),
      is_current_user: index === 22 // Current user is rank 23
    }));

    return {
      status: 'success',
      data: leaderboardData,
      meta: {
        scope,
        period: 'current_month',
        updated_at: new Date().toISOString()
      }
    };
  }

  // Reports
  async getMonthlyReport(year, month) {
    await this.request(`/reports/monthly/${year}/${month}`);
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, index) => ({
      date: `${year}-${month.toString().padStart(2, '0')}-${(index + 1).toString().padStart(2, '0')}`,
      co2e: Math.random() * 5 + 1,
      activities: Math.floor(Math.random() * 5) + 1,
      points: Math.floor(Math.random() * 100) + 20
    }));

    const totalCO2 = dailyData.reduce((sum, day) => sum + day.co2e, 0);
    const totalPoints = dailyData.reduce((sum, day) => sum + day.points, 0);

    return {
      status: 'success',
      data: {
        period: `${year}-${month.toString().padStart(2, '0')}`,
        summary: {
          total_co2e: parseFloat(totalCO2.toFixed(2)),
          total_points: totalPoints,
          total_activities: dailyData.reduce((sum, day) => sum + day.activities, 0),
          avg_daily_co2e: parseFloat((totalCO2 / daysInMonth).toFixed(2)),
          best_day: dailyData.reduce((min, day) => day.co2e < min.co2e ? day : min),
          worst_day: dailyData.reduce((max, day) => day.co2e > max.co2e ? day : max)
        },
        daily_data: dailyData,
        breakdown: {
          transport: totalCO2 * 0.65,
          energy: totalCO2 * 0.25,
          waste: totalCO2 * 0.10
        },
        comparison: {
          previous_month: totalCO2 * 1.08,
          faculty_average: totalCO2 * 0.92,
          improvement_suggestions: [
            'Consider using BTS/MRT more frequently',
            'Try walking or cycling for short distances',
            'Monitor electricity usage in your room'
          ]
        }
      }
    };
  }

  // Helper method to update carbon summary
  updateCarbonSummary(co2Change) {
    const summary = mockDatabase.carbonSummary[this.currentUser];
    summary.today += co2Change;
    summary.week += co2Change;
    summary.month += co2Change;
    summary.year += co2Change;
  }

  // Simulate API errors for testing
  async simulateError(errorType = 'network') {
    await delay(this.requestDelay);
    
    const errors = {
      network: new Error('Network error: Unable to connect'),
      validation: new Error('Validation error: Invalid data provided'),
      unauthorized: new Error('Unauthorized: Please login again'),
      server: new Error('Internal server error: Please try again later'),
      notfound: new Error('Not found: Resource does not exist')
    };

    throw errors[errorType] || errors.network;
  }

  // Reset mock data (useful for testing)
  resetMockData() {
    mockDatabase = {
      users: { /* ... reset to initial state ... */ },
      activities: { /* ... reset to initial state ... */ },
      carbonSummary: { /* ... reset to initial state ... */ }
    };
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();

// Export class for testing
export default MockApiService;

// Usage Examples:
/*
// In your components:
import { mockApiService } from '../services/mockApiService';

// Get dashboard data
const dashboardData = await mockApiService.getDashboardData();

// Create new activity
const newActivity = await mockApiService.createActivity({
  type: 'transport',
  sub_type: 'bts',
  title: 'BTS to Mall',
  distance: 8.5,
  co2e_calculated: 0.17,
  points_earned: 25
});

// Get monthly report
const report = await mockApiService.getMonthlyReport(2024, 3);
*/
```

## เพิ่ม: Testing Examples

```jsx
// src/components/__tests__/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../ui/Button/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn--loading');
  });

  test('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--secondary');
  });

  test('renders with start and end icons', () => {
    render(
      <Button 
        startIcon={<span data-testid="start-icon">🚀</span>}
        endIcon={<span data-testid="end-icon">✨</span>}
      >
        With Icons
      </Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });
});

// src/components/__tests__/CarbonSummaryCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CarbonSummaryCard from '../domain/CarbonSummaryCard/CarbonSummaryCard';

describe('CarbonSummaryCard Component', () => {
  const defaultProps = {
    title: 'Today\'s Footprint',
    value: 2.5,
    unit: 'kg CO2e',
    trend: -12,
    period: 'today'
  };

  test('renders carbon data correctly', () => {
    render(<CarbonSummaryCard {...defaultProps} />);
    
    expect(screen.getByText('Today\'s Footprint')).toBeInTheDocument();
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('kg CO2e')).toBeInTheDocument();
    expect(screen.getByText('today')).toBeInTheDocument();
  });

  test('formats large values correctly', () => {
    render(<CarbonSummaryCard {...defaultProps} value={1500} />);
    expect(screen.getByText('1.5k')).toBeInTheDocument();
  });

  test('shows correct trend direction', () => {
    const { rerender } = render(<CarbonSummaryCard {...defaultProps} trend={15} />);
    expect(screen.getByText('↑ 15%')).toBeInTheDocument();

    rerender(<CarbonSummaryCard {...defaultProps} trend={-8} />);
    expect(screen.getByText('↓ 8%')).toBeInTheDocument();

    rerender(<CarbonSummaryCard {...defaultProps} trend={0} />);
    expect(screen.getByText('No change')).toBeInTheDocument();
  });

  test('handles click events when provided', () => {
    const handleClick = jest.fn();
    render(<CarbonSummaryCard {...defaultProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    render(<CarbonSummaryCard {...defaultProps} loading />);
    expect(screen.getByRole('button')).toHaveClass('card--loading');
  });
});

// src/hooks/__tests__/useForm.test.js
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm Hook', () => {
  const initialValues = {
    email: '',
    password: ''
  };

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    },
    password: {
      required: true,
      min: 6,
      message: 'Password must be at least 6 characters'
    }
  };

  test('initializes with correct values', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('handles value changes', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    
    expect(result.current.values.email).toBe('test@example.com');
  });

  test('validates fields on blur', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    act(() => {
      result.current.handleChange('email', 'invalid-email');
      result.current.handleBlur('email');
    });
    
    expect(result.current.errors.email).toBe('Please enter a valid email');
    expect(result.current.touched.email).toBe(true);
  });

  test('validates all fields', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    let isValid;
    act(() => {
      isValid = result.current.validateAll();
    });
    
    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.password).toBeTruthy();
  });

  test('resets form', () => {
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleBlur('email');
      result.current.reset();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});
```

## 📤 แก้ไข Deliverables & Grading Rubric

### ไฟล์ที่ต้องส่ง (แก้ไข):

1. **Component_Architecture_Tree.png** ✅
2. **Props_Interface_Documentation.md** ✅
3. **UI_Components/** ✅ + เพิ่มเติม
4. **Domain_Components/** ✅ + เพิ่ม TransportForm
5. **Container_Components/** ✅ + เพิ่ม Error Handling
6. **Custom_Hooks/** ✅ + ปรับปรุง
7. **services/mockApiService.js** 🆕 เพิ่มใหม่
8. **ErrorBoundary/** 🆕 เพิ่มใหม่ 
9. **__tests__/** 🆕 เพิ่มใหม่ (Optional สำหรับ bonus)
10. **Component_Usage_Guide.md** ✅ ปรับปรุง
11. **Demo_App/** ✅ พร้อม working examples

### Updated Project Structure:

```
LAB06_ComponentDesign_GroupX/
├── README.md
├── package.json
├── public/
├── src/
│   ├── components/
│   │   ├── ui/           # Basic UI Components
│   │   ├── domain/       # Business Logic Components
│   │   ├── layout/       # Layout Components
│   │   └── common/       # Shared Components (ErrorBoundary)
│   ├── containers/       # Smart Components
│   ├── hooks/           # Custom Hooks
│   ├── services/        # API Services
│   ├── utils/           # Utility functions
│   ├── __tests__/       # Test files (optional)
│   └── App.js
└── docs/
    ├── Component_Architecture_Tree.png
    ├── Props_Interface_Documentation.md
    └── Component_Usage_Guide.md
```

### 🏆 Updated Grading Rubric (100 คะแนน):

| หัวข้อ | คะแนน | เกณฑ์การให้คะแนน |
|--------|-------|------------------|
| **Component Architecture & Separation** | 20 | Perfect separation (18-20), Good separation (14-17), Basic separation (10-13), Poor/No separation (0-9) |
| **UI Components Quality** | 20 | Highly reusable + great props design (18-20), Good reusability (14-17), Basic functionality (10-13), Poor quality (0-9) |
| **Domain Components** | 20 | Perfect business logic integration (18-20), Good integration (14-17), Basic integration (10-13), Poor/Missing (0-9) |
| **Container Components & State** | 15 | Excellent state management (13-15), Good management (10-12), Basic management (7-9), Poor/Missing (0-6) |
| **Custom Hooks & Services** | 10 | Clean, reusable logic (9-10), Good logic (7-8), Basic logic (5-6), Poor/Missing (0-4) |
| **Error Handling & UX** | 10 | Comprehensive error handling (9-10), Good handling (7-8), Basic handling (5-6), Poor/Missing (0-4) |
| **Documentation & Demo** | 5 | Complete, clear docs + working demo (5), Good docs/demo (3-4), Basic docs/demo (1-2), Missing/Poor (0) |

**Bonus Points:**
- **+10:** Complete test suite with >80% coverage
- **+5:** TypeScript implementation
- **+5:** Storybook integration
- **+3:** Advanced animations and micro-interactions
- **+3:** Accessibility features (ARIA, keyboard navigation)
- **+2:** Responsive design excellence

**Penalty:**
- **-15:** Code doesn't run or has critical errors
- **-10:** Poor file structure or naming conventions
- **-5:** Missing error handling in critical components

---
