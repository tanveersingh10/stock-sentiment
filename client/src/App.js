import './App.css';
import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Grid, Box, Typography, Link } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const App = () => {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchedTicker, setSearchedTicker] = useState("")
  const messages = [
    "Scraping the web ...",
    "Summarising articles ...",
    "Calculating market sentiment ...",
    "Asking Nancy Pelosi ...",
    "Reading 'Rich Dad Poor Dad' ...",
    "Taking a quick course on financial markets ...",
    "Watching Wolf of Wall Street ...",
    "Searching for news articles ...",
    "Shorting GameStop ...",
    "Putting parents' retirement fund in Bitcoin ...",
    "Doing market research ...",
    "Double checking analysis ..."
  ];

  const handleSubmit = (event) => {
    if (ticker == ""){
      return alert("Please Enter a Ticker")
    }
    event.preventDefault();
    setSearchedTicker(ticker)
    setLoading(true);
    setGenerated(true);
    console.log('reached here')
    axios.get(`http://127.0.0.1:5000/analyze/${ticker}`)
      .then((response) => {
        let dataArray = JSON.parse(response.data)
        setData(dataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    let interval = null;
    if (loading) {
      interval = setInterval(() => {
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 6000); // change message every 3 seconds
    } else if (!loading && currentMessage !== "") {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading, currentMessage]);


  if (!generated){
    return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Grid container direction="column" sx={{ height: '100vh', p: 3 }} alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                Latest News Summaries and Market Sentiment With a Single Click!
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ p: 3, borderRadius: 1, boxShadow: 1 }}>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <TextField id="outlined-basic" label="Enter Ticker" variant="outlined" fullWidth value={ticker} onChange={(e) => setTicker(e.target.value)} />
                  <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%' }} type="submit">
                    Analyze
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
      </ThemeProvider>
    )
  
  }
  else if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
            <CircularProgress />
            <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
              {currentMessage}
            </Typography>
          </Grid>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box sx={{m: 5}}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 4}}>
                <TextField 
                  id="outlined-basic" 
                  label="Enter Ticker" 
                  variant="outlined" 
                  value={ticker} 
                  onChange={(e) => setTicker(e.target.value)} 
                  fullWidth
                />
                <Button variant="contained" color="primary" type="submit" sx={{mr: 4}}>
                  Analyze
                </Button>
              </Box>
            {data.length > 0 && (
              <Typography variant="h5" sx={{mb: 2}}>
                {searchedTicker.toUpperCase()} Analysis
              </Typography>
            )}
              <Paper elevation={3}>
                <TableContainer>
                  <Table aria-label="simple table" >
                    <TableHead>
                      <TableRow>
                        <TableCell>Summary</TableCell>
                        <TableCell>Sentiment</TableCell>
                        <TableCell>Confidence</TableCell>
                        <TableCell>URL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row['Summary']}</TableCell>
                          <TableCell sx={{color: row['Sentiment'] === 'POSITIVE' ? 'lime' : 'red'}}>
                            {row['Sentiment']}
                          </TableCell>
                          <TableCell>{row['Confidence']}</TableCell>
                          <TableCell>
                            <Link href={row['URL']} target="_blank" rel="noopener">
                              Go to Article
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </form>
          </Box>
      </ThemeProvider>


    );
  }
}

export default App;

