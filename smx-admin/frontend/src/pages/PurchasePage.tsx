import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Collapse,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Link,
  TextField,
  InputAdornment,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ReceiptLong as ReceiptIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { searchKeyService } from '../services/searchKey.service';
import type { Purchase } from '../types/searchKey';
import TableSkeleton from '../components/TableSkeleton';

const statusColor = (status?: string | null) => {
  switch (status) {
    case 'succeeded':
      return 'success';
    case 'processing':
      return 'warning';
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'warning';
    case 'canceled':
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const formatAmount = (amount: number | null, currency: string | null | undefined) => {
  if (!amount) return '-';
  if (!currency) currency = 'USD';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
};

function exportToCSV(data: Purchase[]) {
  const header = [
    'Email',
    'First Name',
    'Last Name',
    'Company',
    'Role',
    'Count',
    'Total Price',
    'Total Discount',
    'Created At',
    'Stripe Payment ID',
    'Payment Status',
    'Paid Amount',
    'Currency',
    'Receipt URL',
  ];
  const rows = data.map((p) => [
    p.user.email,
    p.user.firstName,
    p.user.lastName,
    p.user.company || '-',
    p.user.role,
    p.count,
    p.totalPrice,
    p.totalDiscount,
    new Date(p.createdAt).toLocaleString(),
    p.stripePaymentId,
    p.paymentStatus || '-',
    p.paymentAmount || '',
    p.paymentCurrency || '',
    p.paymentReceiptUrl || '',
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'purchases.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export const PurchasePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, any>>({});
  const [detailsLoading, setDetailsLoading] = useState<Record<string, boolean>>({});
  const [detailsError, setDetailsError] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Purchase[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchKeyService.getAllPurchases();
        setPurchases(data || []);
        setFiltered(data || []);
      } catch (err) {
        setError('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(purchases);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        purchases.filter(
          (row) =>
            row.user.email.toLowerCase().includes(s) ||
            (row.user.company || '').toLowerCase().includes(s)
        )
      );
    }
  }, [search, purchases]);

  const handleExpandClick = async (stripePaymentId: string) => {
    if (expanded === stripePaymentId) {
      setExpanded(null);
      return;
    }
    setExpanded(stripePaymentId);
    if (!details[stripePaymentId] && !detailsLoading[stripePaymentId]) {
      setDetailsLoading((prev) => ({ ...prev, [stripePaymentId]: true }));
      setDetailsError((prev) => ({ ...prev, [stripePaymentId]: '' }));
      try {
        const paymentDetails = await searchKeyService.getPurchasePaymentDetails(stripePaymentId);
        setDetails((prev) => ({ ...prev, [stripePaymentId]: paymentDetails }));
      } catch (err) {
        setDetailsError((prev) => ({
          ...prev,
          [stripePaymentId]: 'Failed to load payment details',
        }));
      } finally {
        setDetailsLoading((prev) => ({ ...prev, [stripePaymentId]: false }));
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Purchases
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          placeholder="Search by email or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 260 }}
        />
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => exportToCSV(filtered)}
        >
          Export CSV
        </Button>
      </Stack>
      {loading ? (
        <TableSkeleton rowCount={8} columnCount={15} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>
                  <Tooltip title="Stripe Payment ID">
                    <span>Stripe Payment ID</span>
                  </Tooltip>
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Total Discount</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((purchase, idx) => (
                <React.Fragment key={purchase.stripePaymentId}>
                  <TableRow
                    hover
                    sx={{ backgroundColor: idx % 2 === 0 ? 'background.paper' : 'grey.50' }}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleExpandClick(purchase.stripePaymentId)}
                      >
                        {expanded === purchase.stripePaymentId ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={purchase.stripePaymentId}>
                        <span
                          style={{
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            verticalAlign: 'bottom',
                          }}
                        >
                          {purchase.stripePaymentId}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={purchase.user.email}>
                        <span>{`${purchase.user.email} (${purchase.user.firstName} ${purchase.user.lastName})`}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={purchase.user.company || ''}>
                        <span>{purchase.user.company || '-'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{purchase.count}</TableCell>
                    <TableCell>
                      {formatAmount(purchase.totalPrice, purchase.paymentCurrency)}
                    </TableCell>
                    <TableCell>
                      {formatAmount(purchase.totalDiscount, purchase.paymentCurrency)}
                    </TableCell>
                    <TableCell>{new Date(purchase.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={15}>
                      <Collapse
                        in={expanded === purchase.stripePaymentId}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ m: 2 }}>
                          {detailsLoading[purchase.stripePaymentId] ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CircularProgress size={20} />
                              <Typography variant="body2">Loading payment details...</Typography>
                            </Box>
                          ) : detailsError[purchase.stripePaymentId] ? (
                            <Typography color="error" variant="body2">
                              {detailsError[purchase.stripePaymentId]}
                            </Typography>
                          ) : details[purchase.stripePaymentId] ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Status:</Typography>
                                <Chip
                                  label={details[purchase.stripePaymentId].paymentStatus || '-'}
                                  color={statusColor(
                                    details[purchase.stripePaymentId].paymentStatus
                                  )}
                                  size="small"
                                  sx={{ textTransform: 'capitalize' }}
                                  disabled
                                />
                              </Box>
                              <Typography>
                                Amount:{' '}
                                <b>
                                  {formatAmount(
                                    details[purchase.stripePaymentId].paymentAmount,
                                    details[purchase.stripePaymentId].paymentCurrency
                                  )}
                                </b>
                              </Typography>
                              <Typography>
                                Created:{' '}
                                <b>
                                  {details[purchase.stripePaymentId].paymentCreated
                                    ? new Date(
                                        details[purchase.stripePaymentId].paymentCreated * 1000
                                      ).toLocaleString()
                                    : '-'}
                                </b>
                              </Typography>
                              {details[purchase.stripePaymentId].paymentReceiptUrl && (
                                <Tooltip title="View Stripe Receipt">
                                  <Link
                                    href={details[purchase.stripePaymentId].paymentReceiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                  >
                                    <ReceiptIcon fontSize="small" /> Receipt
                                  </Link>
                                </Tooltip>
                              )}
                            </Box>
                          ) : null}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default PurchasePage;
