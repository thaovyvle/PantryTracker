'use client'
import { Box, Stack, Typography, Button, Modal, TextField, IconButton, Input } from "@mui/material";
import { firestore, storage } from "@/firebase";
import { collection, query, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: "20px",
  border: '2px solid #5185f5',
  boxShadow: 25,
  p: 4,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'Pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ id: doc.id, name: doc.data().name, imgSrc: doc.data().imgSrc, quantity: doc.data().quantity });
      });
      console.log(pantryList);
      setPantry(pantryList);
    };
    updatePantry();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); 
    console.log(image);
  };

  const uploadImage = async (image) => {
    if (!image) return '';
    const imageRef = ref(storage, `${image.name}`);
    await uploadBytes(imageRef, image);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  const addItem = async (itemName, quantity, imageFile) => {
    const imageURL = imageFile ? await uploadImage(imageFile) : '';
    const newItemRef = doc(collection(firestore, 'Pantry'));
    await setDoc(newItemRef, {
      id: newItemRef.id,
      name: itemName,
      imgSrc: imageURL,
      quantity: quantity
    });
    setPantry((prevPantry) => [...prevPantry, { id: newItemRef.id, name: itemName, imgSrc: imageURL, quantity: quantity }]);
    handleClose();
  };

  const updateQuantity = async (id, newQuantity) => {
    const itemRef = doc(firestore, 'Pantry', id);
    if (newQuantity <= 0) {
      // Delete the item if quantity is zero or less
      await deleteDoc(itemRef);
      setPantry((prevPantry) => prevPantry.filter((item) => item.id !== id));
    } else {
      await updateDoc(itemRef, { quantity: newQuantity });
      setPantry((prevPantry) => prevPantry.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const incrementQuantity = (id, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(id, newQuantity);
  };

  const decrementQuantity = (id, currentQuantity) => {
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(id, newQuantity);
    }
  };

  // Filter pantry items based on the search query
  const filteredPantry = pantry.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display={'flex'} alignItems={'center'} flexDirection={'column'}>
      <Box marginTop={"50px"} borderRadius={'25px'} marginBottom={"20px"}>
        <Box width="100vw" height="80px" borderBottom={"3px solid #5185f5"} marginBottom={"20px"}>
          <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'} fontWeight={"bold"}>
            Pantry Tracker
          </Typography>
        </Box>
        <Box width="100vw" alignItems={'center'} display={'flex'} justifyContent={'center'} marginBottom={'20px'}>
          <TextField
            variant="filled"
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginRight: '20px', width: '400px', backgroundColor: "white", borderRadius: '30px'}}
          />
          <Button variant="contained" onClick={handleOpen} 
            sx={{ 
              backgroundColor: '#5185f5', 
              color: 'white', 
              borderRadius: "30px",
              width: '150px', 
              height: '50px',
              '&:hover': {
                backgroundColor: '#4169c4',
              },
            }}>
            Add New Item
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h8" component="h2" color="black" marginBottom="15px" fontWeight="bold"> 
                Add New Item to Pantry
              </Typography>
              <Stack direction={'column'} spacing={2}>
                <TextField
                  id="item-name"
                  label="Item Name"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                  id="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Box alignItems={'center'} justifyContent={'center'} display={'flex'}>
                  <Button variant="contained" 
                    onClick={() => { 
                      addItem(itemName, quantity, image);
                    }}
                    sx={{ 
                      backgroundColor: '#5185f5', 
                      color: 'white', 
                      width: '100px', 
                      height: '50px',
                      borderRadius: "30px",
                      '&:hover': {
                        backgroundColor: '#4169c4',
                      },
                    }} 
                  >
                    Add
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
        </Box>
        <Stack width="100vw" height="100vh" overflow={'auto'} direction={'row'} gap={'10px'} padding={'50px'} flexWrap={'wrap'}>
          {filteredPantry.map((item) => (
            <Box 
              key={item.id}
              width="calc(20% - 10px)"
              height="350px"
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              bgcolor={'white'}
              borderRadius={'30px'}
              marginBottom={'10px'}
              flexDirection={"column"}
            >
              <img src={item.imgSrc} alt={item.name} style={{ width: '70%', height: 'auto', borderRadius: '20px' }} />
              <Typography variant={'h4'} color={'#5185f5'} textAlign={'center'} fontWeight="bold">
                {item.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={3} paddingTop={"10px"}>
                <IconButton onClick={() => decrementQuantity(item.id, item.quantity)} size="small" sx={{ color: '#5185f5', bgcolor: "rgb(8, 7, 43)", padding: '3px', fontSize: 'small' }}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant={'h4'} color={'rgb(8, 7, 43)'} textAlign={'center'}>
                  {item.quantity}
                </Typography>
                <IconButton onClick={() => incrementQuantity(item.id, item.quantity)} size="small" sx={{ color: '#5185f5', bgcolor: "rgb(8, 7, 43)", padding: '3px', fontSize: 'small' }}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
