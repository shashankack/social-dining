import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "#000",
  color: "#fff",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  input: { color: "#fff" },
  "& .MuiInput-underline:before": { borderBottomColor: "#B55725" },
  "& .MuiInput-underline:after": { borderBottomColor: "#B55725" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: "#B55725",
  },
};

const ClubRegister = ({ open, handleClose, club }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          style: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        },
      }}
    >
      <Box sx={style}>
        <Grow in={open} timeout={400}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                Join {club?.title}
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: "#B55725" }}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack spacing={2} mt={2}>
              {[
                "Name",
                "Contact",
                "Email",
                "Instagram",
                "City",
                "What draws you to this club?",
              ].map((label) => (
                <TextField
                  key={label}
                  label={label}
                  variant="standard"
                  fullWidth
                  InputProps={{ disableUnderline: false }}
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={textFieldStyle}
                />
              ))}

              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  console.log("Submitting Club Join Form...");
                }}
                sx={{
                  mt: 2,
                  bgcolor: "#B55725",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#B55725" },
                }}
              >
                Submit & Join
              </Button>
            </Stack>
          </Box>
        </Grow>
      </Box>
    </Modal>
  );
};

export default ClubRegister;
