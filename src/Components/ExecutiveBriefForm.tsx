import { BASE_URL } from "../utils/BASE_URL";
import { useEffect, useState } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, } from "@mui/material";
import { toast } from "sonner";
import { Toaster } from "sonner";


const ExecutiveForm = () => {

  type Campaign = {
    campaign_id: string;
    title: string;
  };

  type Event = {
    event_id: string;
    title: string;
  };

  type SME = {
    user_id: string;
    full_name: string;
  };

  const [errors, setErrors] = useState({ title: "", brief: "", contentType: "", campaignId: "", tags: "", sme: "" });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [eventsWrtContent, setEventWrtContent] = useState<Event[]>([]);
  const [smeList, setSmeList] = useState<SME[]>([]);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [eventId, setEventId] = useState("");
  const [contentType, setContentType] = useState("");
  const [smeId, setSmeId] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!brief.trim()) newErrors.brief = "Brief is required";
    if (!contentType) newErrors.contentType = "Content type is required";
    if (!campaignId) newErrors.campaignId = "Campaign is required";
    if (!smeId) newErrors.sme = "smeId is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const fetchCampaigns = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${BASE_URL}/board/campaigns/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      console.log("Token invalid or expired");
      localStorage.clear();
      window.location.href = "/login";

      return;
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Something went wrong");
    }
    const data = await res.json();
    setCampaigns(data);

  } catch (err: any) {
    console.error("Error fetching campaigns:", err.message);

  }
};

  const fetchEvents = async (campaignId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${BASE_URL}/board/campaigns/${campaignId}/events/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setEventWrtContent(data.events);
    }
    catch (err) {
      console.error(err);
    }
  };

  const fetchSME = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/content/contents/sme`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json();
      setSmeList(data);
      console.log(data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const createContent = async () => {
    if (!validateForm()) return;

    setLoading(true); 

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${BASE_URL}/content/contents/initiate/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          brief,
          content_type: contentType,
          campaign_id: campaignId,
          event_id: eventId,
          sme_id: smeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Something went wrong ");
        return;
      }

      toast.success("Content brief created successfully");

      setTitle("");
      setBrief("");
      setContentType("");
      setCampaignId("");
      setEventId("");
      //setTags("");
      setSmeId("");

    } catch (err) {
      console.error(err);
      toast.error("Server error ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchSME();
  }, []);

  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>
     
      <Box
        sx={{
          width: "60%",
          margin: "40px auto",
          padding: 2,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
       <Typography sx={{ mb: 1, mt: 1 }}>Title</Typography>
        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        //margin="normal"
        />
        <Typography sx={{ mb: 1, mt: 1 }}>Brief</Typography>
        {/* Brief */}
        <TextField
          fullWidth
          label="Brief"
          multiline
          rows={4}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          error={!!errors.brief}
          helperText={errors.brief}
        // margin="normal"
        />

       <Typography sx={{ mb: 1, mt: 1 }}>Content Type</Typography>
        {/* Content Type */}
        <FormControl fullWidth >
          <InputLabel>Content Type</InputLabel>
          <Select
            value={contentType}
            label="Content Type"
            onChange={(e) => setContentType(e.target.value)}
          >
            <MenuItem value="use_case">Use Case</MenuItem>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="blog">Blog</MenuItem>
            <MenuItem value="case_study">Case Study</MenuItem>
            <MenuItem value="webinar">Webinar</MenuItem>
            <MenuItem value="white_paper">White Paper</MenuItem>
            <MenuItem value="e_book">E-book</MenuItem>
          </Select>
          <Typography color="error" variant="caption">
            {errors.contentType}
          </Typography>
        </FormControl>

        <Typography sx={{ mb: 1, mt: 1 }}>Campaign</Typography>
        {/* Campaign */}
        <FormControl fullWidth>
          <InputLabel>Campaign</InputLabel>
          <Select
            value={campaignId}
            label="Campaign"
            onChange={(e) => {
              const selectedId = e.target.value;
              setCampaignId(selectedId);
              fetchEvents(selectedId);
            }}
          >
            {campaigns.map((camp) => (
              <MenuItem key={camp.campaign_id} value={camp.campaign_id}>
                {camp.title}
              </MenuItem>
            ))}
          </Select>
          <Typography color="error" variant="caption">
            {errors.campaignId}
          </Typography>
        </FormControl>

        <Typography sx={{ mb: 1, mt: 1 }}>Event</Typography>
        <FormControl fullWidth>
          <InputLabel>Event</InputLabel>
          <Select
            value={eventId}
            label="Event"
            onChange={(e) => setEventId(e.target.value)}
          >
            {eventsWrtContent.map((event) => (
              <MenuItem key={event.event_id} value={event.event_id}>
                {event.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography sx={{ mb: 1, mt: 1 }}>Select SME</Typography>
        <FormControl fullWidth>
          <InputLabel>SME</InputLabel>
          <Select
            value={smeId}
            label="SME"
            onChange={(e) => setSmeId(e.target.value)}
          >
            {smeList.map((sme) => (
              <MenuItem key={sme.user_id} value={sme.user_id}>
                {sme.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            className="!bg-blue-950 !text-white"
            onClick={createContent}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ExecutiveForm;