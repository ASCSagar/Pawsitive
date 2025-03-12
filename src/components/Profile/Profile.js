import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Avatar,
  Divider,
  IconButton,
  Card,
  CardContent,
  Button,
  Grid,
  CardHeader,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Badge
} from "@mui/material";
import { auth, db, database } from "../../firebase"; // Import Firebase
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, set, get, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PetsIcon from "@mui/icons-material/Pets";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AddIcon from "@mui/icons-material/Add";
import ResourceCard from "../Resources/ResourceCard/ResourceCard"; 

// Tab Panel component for the pet profile
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pet-tabpanel-${index}`}
      aria-labelledby={`pet-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const [likedResources, setLikedResources] = useState([]);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [pets, setPets] = useState([]);
  const [openPetDialog, setOpenPetDialog] = useState(false);
  const [currentPet, setCurrentPet] = useState({
    id: '',
    name: '',
    type: 'dog',
    breed: '',
    gender: '',
    age: '',
    weight: '',
    color: '',
    description: '',
    medical: {
      conditions: '',
      allergies: '',
      medications: ''
    },
    vaccinations: []
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openVaccinationDialog, setOpenVaccinationDialog] = useState(false);
  const [currentVaccination, setCurrentVaccination] = useState({
    name: '',
    date: null,
    nextDue: null,
    notes: ''
  });
  const [vaccinationEditIndex, setVaccinationEditIndex] = useState(-1);
  const navigate = useNavigate();

  // Fetch liked resources from Firestore
  const fetchLikedResources = async () => {
    if (!user) return;

    try {
      // First try to get from Realtime Database
      const userLikesRef = ref(database, `userLikes/${user.uid}`);
      const snapshot = await get(userLikesRef);
      
      if (snapshot.exists()) {
        const likedResourceIds = Object.keys(snapshot.val());
        const likedResourcesArray = [];
        
        for (const resourceId of likedResourceIds) {
          // Try to get resource from Realtime Database first
          const resourceRef = ref(database, `resources/${resourceId}`);
          const resourceSnapshot = await get(resourceRef);
          
          if (resourceSnapshot.exists()) {
            const resourceData = resourceSnapshot.val();
            likedResourcesArray.push({
              id: resourceId,
              ...resourceData
            });
          } else {
            // Fallback to Firestore
            try {
              const resourceDoc = await getDoc(doc(db, "resources", resourceId));
              if (resourceDoc.exists()) {
                likedResourcesArray.push({
                  id: resourceId,
                  ...resourceDoc.data()
                });
              }
            } catch (err) {
              console.warn("Could not fetch resource from Firestore:", err);
            }
          }
        }
        
        setLikedResources(likedResourcesArray);
      } else {
        // Fallback to old Firestore method
        const resourcesCollection = collection(db, "resources");
        const q = query(resourcesCollection);
        const querySnapshot = await getDocs(q);
        const likedResourcesArray = [];

        for (const resourceDoc of querySnapshot.docs) {
          const likesCollection = collection(
            db,
            "resources",
            resourceDoc.id,
            "likes"
          );
          const likeDocRef = doc(likesCollection, user.uid);
          const likeDoc = await getDoc(likeDocRef);
          if (likeDoc.exists()) {
            const resourceData = resourceDoc.data();
            likedResourcesArray.push({
              id: resourceDoc.id,
              ...resourceData,
            });
          }
        }

        setLikedResources(likedResourcesArray);
      }
    } catch (error) {
      console.error("Error fetching liked resources:", error);
    }
  };

  // Fetch comments
  const fetchUserComments = async () => {
    if (!user) return;

    try {
      // Try to get from Realtime Database first
      const userCommentsRef = ref(database, `userComments/${user.uid}`);
      const snapshot = await get(userCommentsRef);
      
      if (snapshot.exists()) {
        const commentsData = snapshot.val();
        const commentsArray = [];
        
        for (const resourceId in commentsData) {
          for (const commentId in commentsData[resourceId]) {
            const comment = commentsData[resourceId][commentId];
            
            // Get resource name
            try {
              const resourceRef = ref(database, `resources/${resourceId}`);
              const resourceSnapshot = await get(resourceRef);
              const resourceName = resourceSnapshot.exists() 
                ? resourceSnapshot.val().name 
                : "Unknown Resource";
              
              commentsArray.push({
                id: commentId,
                resourceId,
                resourceName,
                ...comment
              });
            } catch (err) {
              console.warn("Error fetching resource for comment:", err);
            }
          }
        }
        
        setComments(commentsArray);
      } else {
        // Fallback to Firestore method
        const commentsArray = [];
        const resourcesCollection = collection(db, "resources");
        const q = query(resourcesCollection);
        const querySnapshot = await getDocs(q);

        for (const resourceDoc of querySnapshot.docs) {
          const commentsCollection = collection(
            db,
            "resources",
            resourceDoc.id,
            "comments"
          );
          const userCommentsQuery = query(
            commentsCollection,
            where("userId", "==", user.uid)
          );
          const commentsSnapshot = await getDocs(userCommentsQuery);
          commentsSnapshot.forEach((commentDoc) => {
            commentsArray.push({
              id: commentDoc.id,
              resourceId: resourceDoc.id,
              resourceName: resourceDoc.data().name,
              ...commentDoc.data(),
            });
          });
        }

        setComments(commentsArray);
      }
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  // Fetch user's pets
  const fetchUserPets = async () => {
    if (!user) return;

    try {
      const userPetsRef = ref(database, `userPets/${user.uid}`);
      const snapshot = await get(userPetsRef);
      
      if (snapshot.exists()) {
        const petsData = snapshot.val();
        const petsArray = Object.keys(petsData).map(petId => ({
          id: petId,
          ...petsData[petId]
        }));
        
        setPets(petsArray);
      } else {
        setPets([]);
      }
    } catch (error) {
      console.error("Error fetching user pets:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open dialog to add a new pet
  const handleAddPet = () => {
    setCurrentPet({
      id: Date.now().toString(),
      name: '',
      type: 'dog',
      breed: '',
      gender: '',
      age: '',
      weight: '',
      color: '',
      description: '',
      medical: {
        conditions: '',
        allergies: '',
        medications: ''
      },
      vaccinations: []
    });
    setIsEditMode(false);
    setOpenPetDialog(true);
  };

  // Open dialog to edit an existing pet
  const handleEditPet = (pet) => {
    setCurrentPet({...pet});
    setIsEditMode(true);
    setOpenPetDialog(true);
  };

  // Save pet to database
  const handleSavePet = async () => {
    if (!user || !currentPet.name) return;

    try {
      const petRef = ref(database, `userPets/${user.uid}/${currentPet.id}`);
      await set(petRef, currentPet);
      
      // Update local state
      if (isEditMode) {
        setPets(pets.map(pet => pet.id === currentPet.id ? currentPet : pet));
      } else {
        setPets([...pets, currentPet]);
      }
      
      setOpenPetDialog(false);
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Failed to save pet information. Please try again.");
    }
  };

  // Delete a pet
  const handleDeletePet = async (petId) => {
    if (!user || !window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const petRef = ref(database, `userPets/${user.uid}/${petId}`);
      await remove(petRef);
      
      // Update local state
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet. Please try again.");
    }
  };

  // Handle vaccination dialog
  const handleAddVaccination = () => {
    setCurrentVaccination({
      name: '',
      date: null,
      nextDue: null,
      notes: ''
    });
    setVaccinationEditIndex(-1);
    setOpenVaccinationDialog(true);
  };

  // Edit existing vaccination
  const handleEditVaccination = (vaccination, index) => {
    setCurrentVaccination({...vaccination});
    setVaccinationEditIndex(index);
    setOpenVaccinationDialog(true);
  };

  // Save vaccination
  const handleSaveVaccination = () => {
    if (!currentVaccination.name || !currentVaccination.date) return;
    
    const updatedPet = {...currentPet};
    updatedPet.vaccinations = updatedPet.vaccinations || [];
    
    if (vaccinationEditIndex >= 0) {
      // Edit existing vaccination
      updatedPet.vaccinations[vaccinationEditIndex] = currentVaccination;
    } else {
      // Add new vaccination
      updatedPet.vaccinations.push(currentVaccination);
    }
    
    setCurrentPet(updatedPet);
    setOpenVaccinationDialog(false);
  };

  // Delete vaccination
  const handleDeleteVaccination = (index) => {
    const updatedPet = {...currentPet};
    updatedPet.vaccinations.splice(index, 1);
    setCurrentPet(updatedPet);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (user) {
      fetchLikedResources();
      fetchUserComments();
      fetchUserPets();
    }
  }, [user]);

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ ml: 2 }}>
          My Profile
        </Typography>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Avatar
          alt={user?.displayName || user?.email}
          src={user?.photoURL}
          sx={{ width: 80, height: 80, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
        />
        <Box>
          <Typography variant="h6">
            {user?.displayName || "Anonymous User"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* My Pets Section */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">
          My Pets
        </Typography>
        <Fab 
          color="primary" 
          size="small" 
          onClick={handleAddPet}
          aria-label="add pet"
        >
          <AddIcon />
        </Fab>
      </Box>

      {pets.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {pets.map((pet) => (
            <Grid item xs={12} sm={6} md={4} key={pet.id}>
              <Card variant="outlined" sx={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: pet.type === 'dog' ? '#1565c0' : '#ff9800' }}>
                      <PetsIcon />
                    </Avatar>
                  }
                  title={pet.name}
                  subheader={`${pet.breed || ''} ${pet.type}`}
                  action={
                    <Box>
                      <IconButton onClick={() => handleEditPet(pet)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePet(pet.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={1}>
                    {pet.gender && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Gender</Typography>
                        <Typography variant="body2">{pet.gender}</Typography>
                      </Grid>
                    )}
                    {pet.age && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Age</Typography>
                        <Typography variant="body2">{pet.age}</Typography>
                      </Grid>
                    )}
                    {pet.color && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Color</Typography>
                        <Typography variant="body2">{pet.color}</Typography>
                      </Grid>
                    )}
                    {pet.weight && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">Weight</Typography>
                        <Typography variant="body2">{pet.weight}</Typography>
                      </Grid>
                    )}
                  </Grid>

                  {pet.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">Description</Typography>
                      <Typography variant="body2">{pet.description}</Typography>
                    </Box>
                  )}

                  {/* Medical info accordion */}
                  <Accordion sx={{ mt: 2, boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ padding: '0 8px', minHeight: 'auto' }}
                    >
                      <Typography variant="body2" fontWeight="medium">Medical Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      {pet.medical?.conditions ? (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">Conditions</Typography>
                          <Typography variant="body2">{pet.medical.conditions}</Typography>
                        </Box>
                      ) : null}

                      {pet.medical?.allergies ? (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">Allergies</Typography>
                          <Typography variant="body2">{pet.medical.allergies}</Typography>
                        </Box>
                      ) : null}

                      {pet.medical?.medications ? (
                        <Box>
                          <Typography variant="body2" color="textSecondary">Medications</Typography>
                          <Typography variant="body2">{pet.medical.medications}</Typography>
                        </Box>
                      ) : null}

                      {!pet.medical?.conditions && !pet.medical?.allergies && !pet.medical?.medications && (
                        <Typography variant="body2">No medical information provided.</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  {/* Vaccination accordion */}
                  <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ padding: '0 8px', minHeight: 'auto' }}
                    >
                      <Badge 
                        badgeContent={pet.vaccinations?.length || 0} 
                        color="primary"
                        sx={{ '& .MuiBadge-badge': { right: -15 } }}
                      >
                        <Typography variant="body2" fontWeight="medium">Vaccination Records</Typography>
                      </Badge>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      {pet.vaccinations && pet.vaccinations.length > 0 ? (
                        <List disablePadding>
                          {pet.vaccinations.map((vaccination, index) => (
                            <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: index < pet.vaccinations.length - 1 ? '1px solid #eee' : 'none' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="medium">{vaccination.name}</Typography>
                                <Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditVaccination(vaccination, index)}
                                    sx={{ p: 0.5 }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                Date: {formatDate(vaccination.date)}
                              </Typography>
                              {vaccination.nextDue && (
                                <Typography variant="body2" color="textSecondary">
                                  Next Due: {formatDate(vaccination.nextDue)}
                                </Typography>
                              )}
                              {vaccination.notes && (
                                <Typography variant="body2" color="textSecondary">
                                  Notes: {vaccination.notes}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2">No vaccination records.</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => {
                      handleEditPet(pet);
                    }}
                  >
                    Edit Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You haven't added any pets to your profile yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddPet}
          >
            Add Your First Pet
          </Button>
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Liked Resources Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Liked Resources
      </Typography>
      {likedResources.length > 0 ? (
        <Grid container spacing={2}>
          {likedResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2">
          You have not liked any resources yet.
        </Typography>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Comments
      </Typography>
      {comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Card variant="outlined">
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#8e24aa" }}>
                      {comment.resourceName.charAt(0)}
                    </Avatar>
                  }
                  title={comment.resourceName}
                  subheader={
                    comment.createdAt?.toDate 
                      ? new Date(comment.createdAt.toDate()).toLocaleString() 
                      : comment.createdAt 
                        ? new Date(comment.createdAt).toLocaleString() 
                        : "Unknown date"
                  }
                />
                <CardContent>
                  <Typography variant="body2">{comment.text}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/resource-details/${comment.resourceId}`, {
                        state: { resourceId: comment.resourceId },
                      })
                    }
                  >
                    View Resource
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </List>
      ) : (
        <Typography variant="body2">
          You have not commented on any resources yet.
        </Typography>
      )}

      {/* Pet Information Dialog */}
      <Dialog 
        open={openPetDialog} 
        onClose={() => setOpenPetDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditMode ? `Edit ${currentPet.name}'s Profile` : "Add New Pet"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="pet profile tabs">
              <Tab label="General Information" id="pet-tab-0" />
              <Tab label="Medical Profile" id="pet-tab-1" />
              <Tab label="Vaccination Records" id="pet-tab-2" />
            </Tabs>
          </Box>

          {/* General Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pet Name"
                  fullWidth
                  required
                  value={currentPet.name}
                  onChange={(e) => setCurrentPet({...currentPet, name: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="pet-type-label">Pet Type</InputLabel>
                  <Select
                    labelId="pet-type-label"
                    value={currentPet.type}
                    onChange={(e) => setCurrentPet({...currentPet, type: e.target.value})}
                    label="Pet Type"
                  >
                    <MenuItem value="dog">Dog</MenuItem>
                    <MenuItem value="cat">Cat</MenuItem>
                    <MenuItem value="bird">Bird</MenuItem>
                    <MenuItem value="fish">Fish</MenuItem>
                    <MenuItem value="rabbit">Rabbit</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Breed"
                  fullWidth
                  value={currentPet.breed || ''}
                  onChange={(e) => setCurrentPet({...currentPet, breed: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="pet-gender-label">Gender</InputLabel>
                  <Select
                    labelId="pet-gender-label"
                    value={currentPet.gender || ''}
                    onChange={(e) => setCurrentPet({...currentPet, gender: e.target.value})}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Unknown">Unknown</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  fullWidth
                  value={currentPet.age || ''}
                  onChange={(e) => setCurrentPet({...currentPet, age: e.target.value})}
                  margin="normal"
                  placeholder="e.g., 2 years"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight"
                  fullWidth
                  value={currentPet.weight || ''}
                  onChange={(e) => setCurrentPet({...currentPet, weight: e.target.value})}
                  margin="normal"
                  placeholder="e.g., 15 kg"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Color/Markings"
                  fullWidth
                  value={currentPet.color || ''}
                  onChange={(e) => setCurrentPet({...currentPet, color: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentPet.description || ''}
                  onChange={(e) => setCurrentPet({...currentPet, description: e.target.value})}
                  margin="normal"
                  placeholder="Special traits, personality, etc."
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Medical Profile Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Medical Conditions"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentPet.medical?.conditions || ''}
                  onChange={(e) => setCurrentPet({
                    ...currentPet, 
                    medical: {...(currentPet.medical || {}), conditions: e.target.value}
                  })}
                  margin="normal"
                  placeholder="Any known health conditions"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Allergies"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentPet.medical?.allergies || ''}
                  onChange={(e) => setCurrentPet({
                    ...currentPet, 
                    medical: {...(currentPet.medical || {}), allergies: e.target.value}
                  })}
                  margin="normal"
                  placeholder="Food or environmental allergies"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Medications"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentPet.medical?.medications || ''}
                  onChange={(e) => setCurrentPet({
                    ...currentPet, 
                    medical: {...(currentPet.medical || {}), medications: e.target.value}
                  })}
                  margin="normal"
                  placeholder="Current medications and dosage"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Vaccination Records Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVaccination}
              >
                Add Vaccination
              </Button>
            </Box>
            
            {currentPet.vaccinations && currentPet.vaccinations.length > 0 ? (
              <Grid container spacing={2}>
                {currentPet.vaccinations.map((vaccine, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ pb: 1 }}>
                        <Typography variant="subtitle1">{vaccine.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {formatDate(vaccine.date)}
                        </Typography>
                        {vaccine.nextDue && (
                          <Typography variant="body2" color="textSecondary">
                            Next Due: {formatDate(vaccine.nextDue)}
                          </Typography>
                        )}
                        {vaccine.notes && (
                          <Typography variant="body2">
                            Notes: {vaccine.notes}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          onClick={() => handleEditVaccination(vaccine, index)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteVaccination(index)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No vaccination records added yet.
              </Typography>
            )}
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPetDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePet} 
            variant="contained" 
            disabled={!currentPet.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vaccination Dialog */}
      <Dialog 
        open={openVaccinationDialog} 
        onClose={() => setOpenVaccinationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {vaccinationEditIndex >= 0 ? "Edit Vaccination Record" : "Add Vaccination Record"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vaccination Name"
                fullWidth
                required
                value={currentVaccination.name}
                onChange={(e) => setCurrentVaccination({...currentVaccination, name: e.target.value})}
                margin="normal"
                placeholder="e.g., Rabies, Distemper, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label="Date Administered"
                  value={currentVaccination.date}
                  onChange={(newDate) => setCurrentVaccination({...currentVaccination, date: newDate})}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label="Next Due Date"
                  value={currentVaccination.nextDue}
                  onChange={(newDate) => setCurrentVaccination({...currentVaccination, nextDue: newDate})}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={currentVaccination.notes || ''}
                onChange={(e) => setCurrentVaccination({...currentVaccination, notes: e.target.value})}
                margin="normal"
                placeholder="Additional information, reactions, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVaccinationDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveVaccination} 
            variant="contained" 
            disabled={!currentVaccination.name || !currentVaccination.date}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;