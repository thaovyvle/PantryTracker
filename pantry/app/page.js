'use client'
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

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

  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const[itemName, setItemName] = useState('')

  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'Pantry'))
      const docs = await getDocs(snapshot) 
      const pantryList = []
      docs.forEach((doc) => {
        pantryList.push(doc.id)
      })
      console.log(pantryList)
      setPantry(pantryList)
    }
    updatePantry()
  }, [])

  const addItem = (item) => {
    console.log(item)
  }

  return (
    <Box width="100vw" height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Box border={'2px solid white'} padding={"20px"} borderRadius={'25px'} marginBottom={"20px"}>
      <Box width="600px" height="80px" borderBottom={"3px solid #5185f5"} marginBottom={"20px"}>
        <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'} fontWeight={'bold'}>
          P A N T R Y  T R A C K E R
        </Typography>
      </Box>
      <Stack width="600px" height="350px" overflow={'auto'}>
        {pantry.map((i) => (
          <Box 
          key={i}
          width="100%"
          minHeight="110px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'white'}
          borderRadius={'20px'}
          marginBottom={'10px'}
          paddingY={'10px'}
          >
            <Typography variant={'h5'} color={'#5185f5'} textAlign={'center'} fontWeight={'bold'}>
              {i}
            </Typography>
          </Box>
        ))}
      </Stack>
      </Box>
      <Button variant="contained" onClick={handleOpen} >Add New Item</Button>
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" color="black" marginBottom="15px"> 
          Add New Item to Pantry
         </Typography>
        <Stack direction={'row'} spacing={2}>
          <TextField id="outlined-basic" label="Item Name" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
          <Button variant="contained" 
          onClick={() => { 
            addItem(itemName) 
            handleClose()
            }} >Add</Button>
        </Stack>
      </Box>
      </Modal>
    </Box>
  );
}
