import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Typography, Paper, Stack, Collapse } from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

const ErrorFallback = ({
  error,
  errorInfo,
  onReset,
  onShowDetails,
  showDetails,
}: {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  onShowDetails: () => void;
  showDetails: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper
        sx={{
          p: 4,
          backgroundColor: 'error.light',
          color: 'error.contrastText',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <ErrorIcon sx={{ fontSize: 64 }} />
          <Typography variant="h4" align="center" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" align="center">
            We apologize for the inconvenience. Please try one of the following:
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onReset}
            >
              Reload Page
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
          </Stack>

          {process.env.NODE_ENV === 'development' && (
            <>
              <Button
                variant="text"
                color="inherit"
                endIcon={
                  <ExpandMoreIcon sx={{ transform: showDetails ? 'rotate(180deg)' : 'none' }} />
                }
                onClick={onShowDetails}
              >
                {showDetails ? 'Hide Error Details' : 'Show Error Details'}
              </Button>
              <Collapse in={showDetails}>
                <Box sx={{ mt: 2, textAlign: 'left', width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Error Details:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper', color: 'error.main' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {error.toString()}
                    </pre>
                    {errorInfo && (
                      <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                          Component Stack:
                        </Typography>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </Paper>
                </Box>
              </Collapse>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  public render() {
    const { hasError, error, errorInfo, showDetails } = this.state;

    if (hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (!error) return null;

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          onReset={this.handleReset}
          onShowDetails={this.toggleDetails}
          showDetails={showDetails}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
