const router = require('express').Router();
const { BackendService } = require('../services');

// Get all crews
router.route('/').get(async (req, res) => {
  try {
    const crews = await BackendService.getCrews();
    res.json(crews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get crews' });
  }
});

// Get a crew by ID
router.route('/:crewId').get(async (req, res) => {
  try {
    const crewId = req.params.crewId;
    const crew = await BackendService.getCrew(crewId);
    if (!crew) {
      return res.status(404).json({ error: 'Crew not found' });
    }
    res.json(crew);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get crew' });
  }
});

// Add a new crew
router.route('/add').post(async (req, res) => {
  try {
    const newCrew = req.body;
    const addedCrew = await BackendService.addCrew(newCrew);
    res.status(201).json(addedCrew);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add crew' });
  }
});

// Update a crew
router.route('/update/:crewId').put(async (req, res) => {
  try {
    const crewId = req.params.crewId;
    const updatedCrew = req.body;
    const result = await BackendService.updateCrew(crewId, updatedCrew);
    if (!result) {
      return res.status(404).json({ error: 'Crew not found' });
    }
    res.json({ message: 'Crew updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update crew' });
  }
});

// Delete a crew
router.route('/delete/:crewId').delete(async (req, res) => {
  try {
    const crewId = req.params.crewId;
    const result = await BackendService.deleteCrew(crewId);
    if (!result) {
      return res.status(404).json({ error: 'Crew not found' });
    }
    res.json({ message: 'Crew deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete crew' });
  }
});

// Import crew from YAML
router.route('/import').post(async (req, res) => {
  try {
    const { yaml, variables } = req.body;
    if (!yaml) {
      return res.status(400).json({ error: 'YAML configuration is required' });
    }

    const importedCrew = await BackendService.importCrewFromYaml(yaml, variables);
    res.status(201).json(importedCrew);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import crew configuration' });
  }
});

// Deploy crew
router.route('/deploy').post(async (req, res) => {
  try {
    const crewConfig = req.body;
    if (!crewConfig || !crewConfig.agents || !crewConfig.tasks) {
      return res.status(400).json({ error: 'Invalid crew configuration' });
    }

    const deployedCrew = await BackendService.deployCrew(crewConfig);
    res.json(deployedCrew);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to deploy crew' });
  }
});

module.exports = router;