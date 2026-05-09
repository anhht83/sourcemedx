import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { SearchKeyList } from '../components/SearchKeyList';

export const SearchKeysPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Keys Management
      </Typography>

      <Grid container spacing={3}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 12' } }}>
          <SearchKeyList />
        </Grid>
      </Grid>
    </Container>
  );
};
