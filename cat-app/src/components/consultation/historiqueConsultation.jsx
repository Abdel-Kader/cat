import React, { useEffect, useState } from 'react';
import Header from '../common/header'
import {
    Grid,
    Button,
    CircularProgress, Backdrop
} from "@material-ui/core";
import { connect } from 'react-redux';
import { Alert } from '@material-ui/lab';
import { getLocalStorage } from "../../utils/localStorageUtil";
import { getHistorique } from '../../services/consultationService';
import { consultationStyles } from '../common/styles/consultationStyle';
import $ from 'jquery'; 
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"

function HistoriqueConsultations(props) {
    const user = getLocalStorage('user')
    const classes = consultationStyles()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    
    useEffect(() => {
        $(document).ready(function () {
            $('#example').DataTable( {
                
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
                }
            });
        });
        props.dispatch(getHistorique(user.id,2))
    }, [])
  
    
    const { consultations, loading } = props
    
    // console.log(consultations) 
    return (
                <div>
                    <Header />
                            <div className="row">
                                <Backdrop className={classes.backdrop} open={loading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            { consultations&&consultations.length > 0 ?
                                <Grid justify='center' container style={{marginTop:100}}>
                                    <Grid item xs={10}>
                                    
                                    <h2>Historique de vos consultations :
                                    </h2>
                                    <h4 style={{color: 'green'}}>{consultations.length} Téléconsultations effectuées</h4>
                                    <table id="example" className="display table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nom du médecin</th>
                                                <th>Téléphone</th>
                                                <th>Spécialité</th>
                                                <th>Date de la consultation</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                consultations.map((consultation, index) => (
                                                    <tr key={index}>
                                                        <td><strong>Dr {consultation.Medecin.User.first_name} {consultation.Medecin.User.last_name}</strong></td>       
                                                        <td><h5>{consultation.Medecin.User.phone_number}</h5></td>       
                                                        <td><h5>{consultation.Medecin.specialite.libelle === 'Généraliste' ? consultation.Medecin.specialite.libelle = "Médecin Généraliste" : consultation.Medecin.specialite.libelle}</h5></td>       
                                                        <td><h5>{new Date(consultation.date_consultation).toLocaleDateString(undefined, options) }</h5></td>       
                                                        {/* <td><h5>5.000 FCFA</h5></td>        */}
                                                        <td><Button style={{textTransform:'none', color:'#4cba75'}} onClick={()=> {props.history.push('detail-consultation',consultation)}}>Détail</Button></td>       
                                                    </tr> 
                                            
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </Grid>
                    </Grid>
                    :
                                    
                                            <Grid justify='center' container style={{ textAlign: 'center', marginTop: 150 }} alignContent='center' align='center'>
                                                {!loading ? <Grid item xs={4}>
                                                    <img src="assets/images/notFound.png" alt="not found" style={{ width: 80 }} />
                                                    <br />
                                                    <br />
                                                    <Alert severity="info">
                                                        <strong>Vous n'avez effectué aucune téléconsultation jusqu'à présent !</strong>
                                                    </Alert>
                                                    <br />
                                                    
                                                </Grid>:null}
                                            </Grid>
                                   
                                        }
                                   
                            
                            </div>
                        </div>
    )

}


const mapStateToProps = (state) => {
    return {
      consultations: state.consultation.consultation,
      errorMessage: state.consultation.error,
      loading: state.consultation.loading,
    }
};

export default connect(mapStateToProps)(HistoriqueConsultations)