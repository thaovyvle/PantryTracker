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
        pantryList.push({ id: doc.id, imgSrc: doc.data().imgSrc, quantity: doc.data().quantity })
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
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Box marginTop={"50px"} borderRadius={'25px'} marginBottom={"20px"}>
      <Box width="100vw" height="80px" borderBottom={"3px solid #5185f5"} marginBottom={"20px"}>
        <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'} fontWeight={'bold'}>
          Pantry Tracker
        </Typography>
      </Box>
      <Box width="100vw" alignItems={'center'} justifyContent={'center'}>
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
      }}>Add New Item</Button>
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
            }}
            sx={{ 
              backgroundColor: '#5185f5', 
              color: 'white', 
              width: '100px', 
              height: '50px',
              '&:hover': {
                backgroundColor: '#4169c4',
              },
            }} >Add</Button>
        </Stack>
      </Box>
      </Modal>
      </Box>
      <Stack width="100vw" height="100vh" overflow={'auto'} direction={'row'} gap={'10px'} padding={'50px'} flexWrap={'wrap'} >
        {pantry.map((item) => (
          <Box 
          key={item}
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
            <img src={item.imgSrc} alt={item.id} style={{ width: '70%', height: 'auto', borderRadius: '20px' }} />
            <Typography variant={'h4'} color={'#5185f5'} textAlign={'center'} fontWeight={'bold'}>
              {item.id}
            </Typography>
            <Typography variant={'h8'} color={'rgb(8, 7, 43)'} textAlign={'center'} marginTop={'5px'} marginBottom={'10px'}>
                Quantity: {item.quantity}
            </Typography>
          </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  );
}
