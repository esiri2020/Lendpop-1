import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Back from "./common/Back";
import numeral from "numeral";
import Questions from '../components/questions';
import Api from '../utils/axios.service';
import Router from 'next/router';

numeral.defaultFormat("0,000");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary["A100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: '20 0',
    width: "100%"
  },

  grid: {
    margin: 0
  },
  smallContainer: {
    width: "100%"
  },
  bigContainer: {
    width: "100%"
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  title: {
    fontSize: "1rem",
    flexGrow: 0,
    textAlign: 'left',
    color: theme.palette.secondary.main
  },

  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    borderRadius: '10px',
    width: '100%'
  },
  successPaper: {
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'space-around'
  },
  successText: {
    margin: '5px 0'
  },
  formPaper: {
    margin: 0,
  },
  formLabel: {
    padding: 8,
    fontSize: '1.2rem',
    color:theme.palette.secondary.main
  },
  formSubLabel: {
    padding: 8,
    fontSize: '1rem',
  },
  formCaption:{
    padding: 8,
    fontSize: '1rem',
  },
  fixedHeight: {
    height: 250,
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
  },
  formControl: {
    width: "100%",
      '& .MuiTextField-root': {
        width: "100%"
      },
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  borderColumn: {
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    paddingBottom: 24,
    marginBottom: 24
  },
  flexBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: '40%',
    "@media screen and (max-width: 600px)":{
      marginRight: '15px'
    }
  }
});

class NewLoanApplicationForm extends Component {
  state = {
    email: this.props.email,
    amount: '',
    loan_cos: '1',
    tenure: '',
    loading: false
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  submit = event => {
    event.preventDefault()
    this.setState({loading:true})
    const data = { ...this.state }
    delete data.setLoading
    Api.loanApplication(JSON.stringify(data)).then(response => {
      this.setState({loading:false})
      console.log(response);
      return Router.reload()
    }).catch(error => {
      console.log(error.response );
    })
  }

  render() {
    const {email, amount, tenure, loading} = this.state
    const handleChange = this.handleChange.bind(this)
    const submit = this.submit.bind(this)
    const { classes } = this.props;

    return(
      <React.Fragment>
        <div className={classes.root}>
          <Grid container
            alignItems="center"
            justify="center"
            container
            className={classes.grid}
            spacing={2}
          >
            <Paper className={classes.paper} >
              <Typography className={classes.formLabel} variant="caption">NEW LOAN APPLICATION</Typography>
              <form className={classes.formControl}
                validate="true" onSubmit={submit}
              autoComplete="off">
                <Grid container spacing={2} style={{margin: 0, width: '100%'}}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      required
                      name="amount"
                      id="outlined-required-amount"
                      type="number"
                      label="Loan Amount"
                      variant="outlined"
                      value={amount}
                      onChange={handleChange}
                      placeholder="Enter amount you want to borrow"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: {
                          max: 10000, min: 100
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      required
                      name="tenure"
                      id="outlined-required-tenure"
                      type="number"
                      label="Loan Tenure"
                      variant="outlined"
                      value={tenure}
                      onChange={handleChange}
                      placeholder="Enter loan tenure in months"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: {
                          max: 36, min: 1
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} className={classes.buttonProgress}/> : 'APPLY'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(NewLoanApplicationForm);
