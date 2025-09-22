# Supervisor Dashboard Setup Guide - ข้อ 5. Basic Styling (UI/UX)

## 5. Basic Styling (UI/UX)

### 🎨 ภาพรวม UI/UX Design

Basic Styling สำหรับ Supervisor Dashboard มุ่งเน้น:
- **Consistency** - ใช้ Material-UI theme system อย่างสม่ำเสมอ
- **Readability** - ข้อมูล Real-time ที่อ่านง่าย สแกนได้เร็ว
- **Visual Hierarchy** - จัดลำดับความสำคัญของข้อมูลให้ชัดเจน
- **Responsive** - ใช้งานได้ดีทั้งใน Desktop และ Mobile

### 🎯 เป้าหมายการเรียนรู้
นักศึกษาจะได้เรียนรู้:
- การใช้ Material-UI Theme system
- Color scheme สำหรับ Real-time status
- Typography และ spacing principles
- Responsive design patterns
- Loading states และ error handling UI

---

## 🎨 Theme Configuration

### 1. สร้าง Custom Theme (src/theme/theme.js)

```javascript
import { createTheme } from '@mui/material/styles';

// สี status ที่ใช้ทั่วทั้งระบบ
export const statusColors = {
  Available: '#4caf50',    // เขียว - พร้อมรับงาน
  Busy: '#ff9800',         // ส้ม - กำลังทำงาน
  Break: '#2196f3',        // น้ำเงิน - พักงาน
  Offline: '#757575',      // เทา - ออฟไลน์
  Online: '#4caf50',       // เขียว - ออนไลน์
  Error: '#f44336'         // แดง - ข้อผิดพลาด
};

// สร้าง theme หลัก
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',       // น้ำเงินเข้ม - สำหรับ header
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',       // แดงเข้ม - สำหรับ emergency
      light: '#ff5983',
      dark: '#9a0036',
    },
    success: {
      main: statusColors.Available,
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: statusColors.Busy,
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: statusColors.Break,
      light: '#64b5f6',
      dark: '#1976d2',
    },
    error: {
      main: statusColors.Error,
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#fafafa',    // พื้นหลังหลัก
      paper: '#ffffff',      // พื้นหลัง card
    },
    text: {
      primary: '#212121',    // ข้อความหลัก
      secondary: '#757575',  // ข้อความรอง
    }
  },
  
  typography: {
    fontFamily: [
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif'
    ].join(','),
    
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#757575',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: '#757575',
    }
  },
  
  spacing: 8, // Base spacing unit = 8px
  
  shape: {
    borderRadius: 8,  // มุมโค้งของ components
  },
  
  components: {
    // ปรับแต่ง Card component
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }
        },
      },
    },
    
    // ปรับแต่ง Chip component
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    
    // ปรับแต่ง AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    
    // ปรับแต่ง Button
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // ไม่ต้อง uppercase
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
```

### 2. Theme Provider Setup (src/App.js)

```javascript
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <Dashboard supervisor={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </ThemeProvider>
  );
}

export default App;
```

---

## 🎨 Status Visualization Components

### 3. Agent Status Card (src/components/AgentStatusCard.js)

```javascript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { statusColors } from '../theme/theme';

const AgentStatusCard = ({ agent, onSendMessage, compact = false }) => {
  // กำหนดสีตาม status
  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.Offline;
  };

  // กำหนดไอคอนตาม status
  const getStatusIcon = (status) => {
    const icons = {
      Available: '✅',
      Busy: '🔄',
      Break: '☕',
      Offline: '🔴'
    };
    return icons[status] || '❓';
  };

  // คำนวณเวลาที่อยู่ใน status ปัจจุบัน
  const getStatusDuration = () => {
    if (!agent.statusSince) return '';
    
    const now = new Date();
    const statusTime = new Date(agent.statusSince);
    const diffMinutes = Math.floor((now - statusTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} นาที`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}ช ${minutes}น`;
    }
  };

  return (
    <Card 
      sx={{ 
        height: compact ? 'auto' : 200,
        position: 'relative',
        border: `2px solid ${getStatusColor(agent.currentStatus)}`,
        borderLeft: `6px solid ${getStatusColor(agent.currentStatus)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1,
                bgcolor: getStatusColor(agent.currentStatus),
                fontSize: '0.875rem'
              }}
            >
              {agent.agentName?.charAt(0) || <PersonIcon />}
            </Avatar>
            
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {agent.agentName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {agent.agentCode}
              </Typography>
            </Box>
          </Box>
          
          {/* Message Button */}
          <Tooltip title="ส่งข้อความ">
            <IconButton 
              size="small" 
              onClick={() => onSendMessage(agent)}
              sx={{ 
                color: 'primary.main',
                '&:hover': { backgroundColor: 'primary.50' }
              }}
            >
              <MessageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Status */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Chip
            label={agent.currentStatus}
            size="small"
            icon={<span>{getStatusIcon(agent.currentStatus)}</span>}
            sx={{
              backgroundColor: getStatusColor(agent.currentStatus),
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: '1rem'
              }
            }}
          />
          
          {/* Connection Status */}
          <Chip
            label={agent.isOnline ? 'Online' : 'Offline'}
            size="small"
            variant="outlined"
            color={agent.isOnline ? 'success' : 'default'}
          />
        </Box>

        {!compact && (
          <>
            {/* Duration */}
            <Box display="flex" alignItems="center" mb={1}>
              <ScheduleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {getStatusDuration() || 'เพิ่งเปลี่ยน'}
              </Typography>
            </Box>

            {/* Additional Info */}
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                อัปเดตล่าสุด: {agent.lastUpdate 
                  ? new Date(agent.lastUpdate).toLocaleTimeString('th-TH')
                  : 'ไม่ทราบ'
                }
              </Typography>
            </Box>
          </>
        )}
      </CardContent>

      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: getStatusColor(agent.currentStatus),
          boxShadow: '0 0 0 2px white',
          animation: agent.isOnline ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 },
          }
        }}
      />
    </Card>
  );
};

export default AgentStatusCard;
```

### 4. Team Statistics Dashboard (src/components/TeamStatsCard.js)

```javascript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { statusColors } from '../theme/theme';

const TeamStatsCard = ({ teamStats, lastUpdate, isRealtime }) => {
  const { totalAgents, onlineAgents, utilization, statusBreakdown } = teamStats;

  // คำนวณเปอร์เซ็นต์แต่ละ status
  const getStatusPercentage = (status) => {
    return totalAgents > 0 ? Math.round((statusBreakdown[status] || 0) / totalAgents * 100) : 0;
  };

  // กำหนดสีสำหรับ utilization bar
  const getUtilizationColor = () => {
    if (utilization >= 80) return 'success';
    if (utilization >= 60) return 'warning';
    return 'error';
  };

  return (
    <Card sx={{ mb: 3, minHeight: 300 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <GroupIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              สถิติทีม
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <Chip
              size="small"
              label={isRealtime ? 'Real-time' : 'Static'}
              color={isRealtime ? 'success' : 'warning'}
              icon={isRealtime ? <RefreshIcon /> : <AccessTimeIcon />}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Overview Stats */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                ภาพรวมทีม
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {totalAgents}
                </Typography>
                <Typography variant="body1" color="text.secondary" ml={1}>
                  คน ทั้งหมด
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {onlineAgents}
                </Typography>
                <Typography variant="body2" color="text.secondary" ml={1}>
                  คน ออนไลน์
                </Typography>
              </Box>

              {/* Utilization */}
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Utilization Rate
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {utilization}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={utilization}
                  color={getUtilizationColor()}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'grey.200'
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Status Breakdown */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              รายละเอียดสถานะ
            </Typography>
            
            <Box>
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <Box key={status} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: statusColors[status],
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {status}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {count} คน ({getStatusPercentage(status)}%)
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={getStatusPercentage(status)}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: statusColors[status],
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Last Update */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            อัปเดตล่าสุด: {lastUpdate 
              ? new Date(lastUpdate).toLocaleString('th-TH')
              : 'ไม่ทราบ'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TeamStatsCard;
```

---

## 📱 Responsive Design

### 5. Responsive Layout Hook (src/hooks/useResponsive.js)

```javascript
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const getGridColumns = (defaultCols = 3) => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return defaultCols;
  };
  
  const getCardSize = () => {
    if (isMobile) return 'small';
    if (isTablet) return 'medium';
    return 'large';
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    getGridColumns,
    getCardSize,
    breakpoints: {
      mobile: 'xs',
      tablet: 'md',
      desktop: 'lg'
    }
  };
};
```

### 6. Responsive Dashboard Layout (src/components/Dashboard.js - Style Updates)

```javascript
import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import TeamStatsCard from './TeamStatsCard';
import AgentStatusCard from './AgentStatusCard';

const Dashboard = ({ supervisor, onLogout }) => {
  const { isMobile, getGridColumns } = useResponsive();
  
  // ... existing logic ...

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header - ปรับให้ responsive */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            {isMobile 
              ? supervisor.agentName 
              : `${supervisor.agentName} - Dashboard`
            }
          </Typography>
          
          {/* Connection Status - ซ่อนใน mobile */}
          {!isMobile && (
            <Chip
              size="small"
              label={getConnectionStatusText()}
              color={getConnectionStatusColor()}
              icon={!isConnected ? <OfflineIcon /> : undefined}
              sx={{ mr: 2 }}
            />
          )}
          
          <IconButton color="inherit" onClick={fetchInitialData}>
            <RefreshIcon />
          </IconButton>
          
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 }
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Team Stats - ขยายเต็มในมือถือ */}
          <Grid item xs={12} lg={4}>
            <TeamStatsCard 
              teamStats={teamStats}
              lastUpdate={lastUpdate}
              isRealtime={isConnected}
            />
          </Grid>
          
          {/* Message Panel - อยู่ด้านล่างในมือถือ */}
          <Grid item xs={12} lg={4}>
            <MessagePanel 
              supervisor={supervisor}
              agents={agents}
              onMessageSent={handleMessageSent}
              isRealtime={isConnected}
            />
          </Grid>
          
          {/* Agent List */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  รายชื่อ Agent ({agents.length})
                </Typography>
                
                <Grid container spacing={2}>
                  {agents.map((agent) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={getGridColumns(2)} 
                      key={agent.agentCode}
                    >
                      <AgentStatusCard
                        agent={agent}
                        onSendMessage={handleDirectMessage}
                        compact={isMobile}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
```

---

## ⚡ Loading States และ Error Handling UI

### 7. Loading Components (src/components/ui/LoadingCard.js)

```javascript
import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Typography
} from '@mui/material';

export const LoadingCard = ({ title, rows = 3 }) => (
  <Card>
    <CardContent>
      {title && (
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
      )}
      
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} mb={2}>
          <Skeleton variant="rectangular" height={60} />
        </Box>
      ))}
    </CardContent>
  </Card>
);

export const LoadingAgentCard = () => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box ml={2} flex={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
      
      <Skeleton variant="rectangular" height={30} width="50%" mb={1} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);
```

### 8. Error Display Component (src/components/ui/ErrorDisplay.js)

```javascript
import React from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'เกิดข้อผิดพลาด',
  showRetry = true 
}) => {
  return (
    <Alert 
      severity="error" 
      sx={{ 
        mb: 2,
        '& .MuiAlert-icon': {
          fontSize: '2rem'
        }
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        {title}
      </AlertTitle>
      
      <Typography variant="body2" mb={showRetry ? 2 : 0}>
        {typeof error === 'string' 
          ? error 
          : error?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
        }
      </Typography>
      
      {showRetry && onRetry && (
        <Button
          variant="contained"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 1 }}
        >
          ลองใหม่
        </Button>
      )}
    </Alert>
  );
};

export default ErrorDisplay;
```

---

## ✅ Style Integration Checklist

### 9. การนำ Components ไปใช้

```javascript
// ใน TeamOverview.js
import { LoadingCard, LoadingAgentCard } from './ui/LoadingCard';
import ErrorDisplay from './ui/ErrorDisplay';
import TeamStatsCard from './TeamStatsCard';
import AgentStatusCard from './AgentStatusCard';

const TeamOverview = ({ 
  agents, 
  teamStats, 
  loading, 
  error, 
  onRetry,
  lastUpdate, 
  isRealtime 
}) => {
  if (loading) {
    return (
      <Box>
        <LoadingCard title="สถิติทีม" rows={3} />
        <Box mt={3}>
          <Typography variant="h6" mb={2}>รายชื่อ Agent</Typography>
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <LoadingAgentCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        title="ไม่สามารถโหลดข้อมูลทีมได้"
      />
    );
  }

  return (
    <Box>
      <TeamStatsCard 
        teamStats={teamStats}
        lastUpdate={lastUpdate}
        isRealtime={isRealtime}
      />
      
      {/* Agent Cards */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            รายชื่อ Agent ({agents.length})
          </Typography>
          
          <Grid container spacing={2}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.agentCode}>
                <AgentStatusCard
                  agent={agent}
                  onSendMessage={onSendMessage}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
```

### ✅ การทดสอบ UI/UX

1. **Theme Consistency**
   - ตรวจสอบสีของ status ต่าง ๆ
   - ลอง hover effects
   - ทดสอบ responsive ในหน้าจอขนาดต่าง ๆ

2. **Loading States**
   - ปิด internet connection ชั่วคราว
   - ดู loading skeletons
   - ทดสอบ error handling

3. **Real-time Visual Feedback**
   - ดู status updates แบบ real-time
   - ตรวจสอบ connection indicator
   - ทดสอบ animation effects

4. **Accessibility**
   - ทดสอบ keyboard navigation
   - ตรวจสอบ color contrast
   - ลอง screen reader compatibility

---

## 🎨 Advanced Styling Features

### 10. Animation และ Transitions (src/styles/animations.js)

```javascript
import { keyframes } from '@mui/material';

// Pulse animation สำหรับ online status
export const pulseAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Fade in animation สำหรับ cards
export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Shake animation สำหรับ error states
export const shakeAnimation = keyframes`
  0%, 20%, 40%, 60%, 80% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
`;

// Status change animation
export const statusChangeAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;
```

### 11. Custom Status Indicator (src/components/ui/StatusIndicator.js)

```javascript
import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { statusColors } from '../../theme/theme';
import { pulseAnimation, statusChangeAnimation } from '../../styles/animations';

const StatusIndicator = ({ 
  status, 
  size = 'medium', 
  showText = true, 
  animated = true,
  justChanged = false 
}) => {
  const getSizeProps = () => {
    const sizes = {
      small: { width: 8, height: 8, fontSize: '0.75rem' },
      medium: { width: 12, height: 12, fontSize: '0.875rem' },
      large: { width: 16, height: 16, fontSize: '1rem' }
    };
    return sizes[size] || sizes.medium;
  };

  const sizeProps = getSizeProps();
  const color = statusColors[status] || statusColors.Offline;

  const getStatusText = () => {
    const textMap = {
      Available: 'พร้อมรับงาน',
      Busy: 'กำลังทำงาน',
      Break: 'พักงาน',
      Offline: 'ออฟไลน์'
    };
    return textMap[status] || status;
  };

  return (
    <Tooltip title={getStatusText()}>
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            width: sizeProps.width,
            height: sizeProps.height,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 0 2px white, 0 0 8px ${color}40`,
            animation: animated && status !== 'Offline' 
              ? `${pulseAnimation} 2s infinite ease-in-out`
              : justChanged 
              ? `${statusChangeAnimation} 1s ease-out`
              : 'none',
            transition: 'all 0.3s ease',
          }}
        />
        
        {showText && (
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              fontSize: sizeProps.fontSize,
              fontWeight: 500,
              color: color
            }}
          >
            {status}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default StatusIndicator;
```

### 12. Real-time Notification Toast (src/components/ui/NotificationToast.js)

```javascript
import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  Notifications as NotificationIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const NotificationToast = ({ 
  open, 
  onClose, 
  message, 
  type = 'info', 
  title,
  autoHideDuration = 6000 
}) => {
  const getIcon = () => {
    const icons = {
      success: <SuccessIcon />,
      warning: <WarningIcon />,
      error: <ErrorIcon />,
      info: <NotificationIcon />
    };
    return icons[type];
  };

  const getSeverity = () => {
    const severityMap = {
      success: 'success',
      warning: 'warning', 
      error: 'error',
      info: 'info'
    };
    return severityMap[type] || 'info';
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }} // ให้อยู่ใต้ AppBar
    >
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        sx={{
          minWidth: 300,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <Typography variant="body2">
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
```

### 13. Connection Status Banner (src/components/ui/ConnectionBanner.js)

```javascript
import React from 'react';
import {
  Alert,
  Box,
  Typography,
  LinearProgress,
  Button,
  Collapse
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const ConnectionBanner = ({ 
  isConnected, 
  isConnecting, 
  error, 
  onRetry,
  retryCount = 0 
}) => {
  const getBannerProps = () => {
    if (isConnecting) {
      return {
        severity: 'info',
        icon: <WifiIcon />,
        title: 'กำลังเชื่อมต่อ...',
        message: 'กำลังพยายามเชื่อมต่อกับระบบ Real-time'
      };
    }
    
    if (error || !isConnected) {
      return {
        severity: 'warning',
        icon: <WifiOffIcon />,
        title: 'การเชื่อมต่อมีปัญหา',
        message: error || 'ไม่สามารถเชื่อมต่อกับระบบ Real-time ได้'
      };
    }
    
    return null;
  };

  const bannerProps = getBannerProps();
  
  if (!bannerProps) return null;

  return (
    <Collapse in={Boolean(bannerProps)}>
      <Alert
        severity={bannerProps.severity}
        icon={bannerProps.icon}
        sx={{
          mb: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          !isConnecting && onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              disabled={isConnecting}
            >
              ลองใหม่
            </Button>
          )
        }
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {bannerProps.title}
          </Typography>
          <Typography variant="body2">
            {bannerProps.message}
          </Typography>
          
          {retryCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              พยายามเชื่อมต่อแล้ว {retryCount} ครั้ง
            </Typography>
          )}
          
          {isConnecting && (
            <LinearProgress 
              sx={{ mt: 1, borderRadius: 1 }}
              color={bannerProps.severity} 
            />
          )}
        </Box>
      </Alert>
    </Collapse>
  );
};

export default ConnectionBanner;
```

---

## 📱 Mobile-First Responsive Updates

### 14. Mobile Navigation (src/components/ui/MobileNavigation.js)

```javascript
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

const MobileNavigation = ({ 
  title, 
  supervisor, 
  onLogout, 
  notificationCount = 0,
  onNavigate 
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'agents', label: 'รายชื่อ Agent', icon: <GroupIcon /> },
    { id: 'messages', label: 'ข้อความ', icon: <MessageIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (itemId) => {
    onNavigate?.(itemId);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          <IconButton color="inherit">
            <Badge badgeContent={notificationCount} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          {/* User Info */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {supervisor?.agentName}
            </Typography>
            <Typography variant="body2" opacity={0.8}>
              Supervisor
            </Typography>
          </Box>

          {/* Navigation Menu */}
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            
            <ListItem button onClick={onLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavigation;
```

### 15. Mobile-Optimized Agent Grid (src/components/ui/MobileAgentGrid.js)

```javascript
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Avatar
} from '@mui/material';
import {
  Message as MessageIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import StatusIndicator from './StatusIndicator';

const MobileAgentCard = ({ agent, onSendMessage, onAgentDetails }) => {
  return (
    <Card 
      sx={{ 
        mb: 1,
        borderLeft: `4px solid ${statusColors[agent.currentStatus]}`,
        '&:active': {
          transform: 'scale(0.98)',
          transition: 'transform 0.1s ease'
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* Agent Info */}
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: statusColors[agent.currentStatus],
                fontSize: '1rem'
              }}
            >
              {agent.agentName?.charAt(0)}
            </Avatar>
            
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                {agent.agentName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {agent.agentCode}
              </Typography>
            </Box>
          </Box>

          {/* Status */}
          <Box display="flex" alignItems="center">
            <StatusIndicator 
              status={agent.currentStatus}
              size="small"
              showText={false}
              animated={true}
            />
            
            <IconButton
              size="small"
              onClick={() => onSendMessage(agent)}
              sx={{ ml: 1 }}
            >
              <MessageIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Status Chip - Mobile friendly */}
        <Box mt={1}>
          <Chip
            label={agent.currentStatus}
            size="small"
            sx={{
              backgroundColor: statusColors[agent.currentStatus],
              color: 'white',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const MobileAgentGrid = ({ agents, onSendMessage, onAgentDetails }) => {
  return (
    <Box>
      {agents.map((agent) => (
        <MobileAgentCard
          key={agent.agentCode}
          agent={agent}
          onSendMessage={onSendMessage}
          onAgentDetails={onAgentDetails}
        />
      ))}
    </Box>
  );
};

export default MobileAgentGrid;
```

---

## ✅ Final Integration และ Testing

### 16. Complete Dashboard with All Styles (src/components/Dashboard.js)

```javascript
import React, { useState, useEffect } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { useResponsive } from '../hooks/useResponsive';

// UI Components
import MobileNavigation from './ui/MobileNavigation';
import ConnectionBanner from './ui/ConnectionBanner';
import NotificationToast from './ui/NotificationToast';
import ErrorDisplay from './ui/ErrorDisplay';

// Feature Components
import TeamStatsCard from './TeamStatsCard';
import AgentStatusCard from './AgentStatusCard';
import MobileAgentGrid from './ui/MobileAgentGrid';
import MessagePanel from './MessagePanel';

const Dashboard = ({ supervisor, onLogout }) => {
  const { isMobile } = useResponsive();
  const [notification, setNotification] = useState(null);
  
  // ... existing state and hooks ...

  const showNotification = (message, type = 'info', title = null) => {
    setNotification({ message, type, title });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Mobile Navigation */}
      {isMobile ? (
        <MobileNavigation
          title={supervisor.agentName}
          supervisor={supervisor}
          onLogout={onLogout}
          notificationCount={0}
        />
      ) : (
        /* Desktop Header - existing AppBar code */
        <AppBar position="static" elevation={0}>
          {/* ... existing header code ... */}
        </AppBar>
      )}

      {/* Connection Status Banner */}
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        <ConnectionBanner
          isConnected={isConnected}
          isConnecting={isConnecting}
          error={connectionError}
          onRetry={handleReconnect}
          retryCount={retryCount}
        />
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {loading ? (
          <LoadingCard title="กำลังโหลดข้อมูล..." rows={5} />
        ) : error ? (
          <ErrorDisplay
            error={error}
            onRetry={fetchInitialData}
            title="ไม่สามารถโหลดข้อมูลได้"
          />
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Team Statistics */}
            <Grid item xs={12} lg={4}>
              <TeamStatsCard
                teamStats={teamStats}
                lastUpdate={lastUpdate}
                isRealtime={isConnected}
              />
            </Grid>

            {/* Message Panel */}
            <Grid item xs={12} lg={4}>
              <MessagePanel
                supervisor={supervisor}
                agents={agents}
                onMessageSent={handleMessageSent}
                isRealtime={isConnected}
              />
            </Grid>

            {/* Agent List */}
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    รายชื่อ Agent ({agents.length})
                  </Typography>

                  {isMobile ? (
                    <MobileAgentGrid
                      agents={agents}
                      onSendMessage={handleDirectMessage}
                      onAgentDetails={() => {}}
                    />
                  ) : (
                    <Grid container spacing={2}>
                      {agents.map((agent) => (
                        <Grid item xs={12} sm={6} key={agent.agentCode}>
                          <AgentStatusCard
                            agent={agent}
                            onSendMessage={handleDirectMessage}
                            compact={false}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Notification Toast */}
      <NotificationToast
        open={Boolean(notification)}
        onClose={handleCloseNotification}
        message={notification?.message}
        type={notification?.type}
        title={notification?.title}
      />
    </Box>
  );
};

export default Dashboard;
```

---

## 📊 การประเมินผล Basic Styling

### ✅ Checklist การทดสอบ UI/UX

**Theme และ Colors:**
- [ ] Status colors แสดงถูกต้องและสม่ำเสมอ
- [ ] Material-UI theme ใช้งานได้ครบทุก component
- [ ] Color contrast ผ่านมาตรฐาน accessibility

**Responsive Design:**
- [ ] Desktop layout แสดงผลถูกต้อง (1200px+)
- [ ] Tablet layout ปรับขนาดได้ (768px-1199px)
- [ ] Mobile layout ใช้งานได้ดี (<768px)
- [ ] Navigation เปลี่ยนเป็น mobile menu ใน small screen

**Real-time Visual Feedback:**
- [ ] Status indicators มี animation เมื่อ online
- [ ] Connection status แสดงผลถูกต้อง
- [ ] Loading states แสดงระหว่างรอข้อมูล
- [ ] Error states แสดงข้อความชัดเจน

**User Experience:**
- [ ] Hover effects ทำงานใน desktop
- [ ] Touch interactions ทำงานใน mobile
- [ ] Notification toasts แสดงในตำแหน่งที่เหมาะสม
- [ ] Form inputs มี validation feedback

**Performance:**
- [ ] Animations ไม่ทำให้ระบบช้า
- [ ] Large lists render ได้เร็ว
- [ ] Image และ assets โหลดเร็ว

---

## 🎯 สรุป Basic Styling (UI/UX)

### ✨ ความสำเร็จที่ได้รับ

1. **Consistent Design System**
   - ใช้ Material-UI theme แบบครบถ้วน
   - มี color palette ที่ชัดเจนสำหรับ status ต่าง ๆ
   - Typography และ spacing ที่สม่ำเสมอ

2. **Responsive และ Mobile-Ready**
   - Layout ปรับตัวได้ตามขนาดหน้าจอ
   - Mobile navigation ที่ใช้งานง่าย
   - Touch-friendly interfaces

3. **Real-time Visual Feedback**
   - Status indicators ที่มีชีวิตชีวา
   - Connection status ที่ชัดเจน
   - Smooth transitions และ animations

4. **User Experience Excellence**
   - Loading states ที่ดูมีคุณภาพ
   - Error handling ที่เป็นมิตร
   - Notification system ที่ไม่รบกวน

### 📚 หัวข้อถัดไป
เมื่อเสร็จสิ้น Basic Styling แล้ว สามารถพัฒนาต่อไปยัง:
- **ข้อ 6. Development & Testing** - Testing และ deployment
- **Advanced Features** - Real-time charts, Performance monitoring
- **Integration Testing** - ทดสอบการทำงานร่วมกับ Backend

**Basic Styling (UI/UX) เสร็จสมบูรณ์! 🎨✨**