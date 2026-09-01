const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');
const AppVersion = require('../models/AppVersion');
const { validate } = require('../middleware/validation');
const { body, validationResult } = require('express-validator');

// ==========================================
// USER - GET LATEST VERSION
// ==========================================

router.get('/latest', async (req, res) => {
  try {
    const { platform, currentVersion } = req.query;

    const query = {
      status: 'published',
      platform: { $in: [platform, 'both'] }
    };

    const latestVersion = await AppVersion.findOne(query)
      .sort({ buildNumber: -1 })
      .select('-__v');

    if (!latestVersion) {
      return res.json({
        success: true,
        updateAvailable: false,
        message: 'You are on the latest version'
      });
    }

    // Check if update is needed
    const needsUpdate = currentVersion !== latestVersion.version;

    res.json({
      success: true,
      updateAvailable: needsUpdate,
      currentVersion: currentVersion,
      latestVersion: latestVersion.version,
      buildNumber: latestVersion.buildNumber,
      isForceUpdate: latestVersion.isForceUpdate,
      isOptionalUpdate: latestVersion.isOptionalUpdate,
      downloadUrl: latestVersion.downloadUrl,
      changeLog: latestVersion.changeLog,
      fileSize: latestVersion.fileSize,
      releaseDate: latestVersion.releaseDate,
      message: needsUpdate
        ? `New version ${latestVersion.version} available!`
        : 'You are on the latest version'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error checking for updates'
    });
  }
});

// ==========================================
// USER - LOG DOWNLOAD
// ==========================================

router.post('/:versionId/download', async (req, res) => {
  try {
    const { versionId } = req.params;

    await AppVersion.findByIdAndUpdate(
      versionId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Download logged'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error logging download'
    });
  }
});

// ==========================================
// ADMIN - GET ALL VERSIONS
// ==========================================

router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const versions = await AppVersion.find()
      .sort({ buildNumber: -1 })
      .limit(50);

    res.json({
      success: true,
      versions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching versions'
    });
  }
});

// ==========================================
// ADMIN - CREATE NEW VERSION
// ==========================================

router.post('/admin/create', authenticateAdmin, [
  body('version').matches(/^\d+\.\d+\.\d+$/).withMessage('Invalid version format'),
  body('buildNumber').isInt().withMessage('Build number must be an integer'),
  body('downloadUrl').isURL().withMessage('Invalid download URL'),
  body('platform').isIn(['android', 'ios', 'both']).withMessage('Invalid platform'),
  body('changeLog').isArray().withMessage('Change log must be an array')
], validate, async (req, res) => {
  try {
    const {
      version,
      buildNumber,
      downloadUrl,
      platform,
      changeLog,
      fileSize,
      isForceUpdate,
      isOptionalUpdate,
      minRequiredVersion
    } = req.body;

    // Check if version already exists
    const existingVersion = await AppVersion.findOne({ version });
    if (existingVersion) {
      return res.status(400).json({
        success: false,
        message: 'Version already exists'
      });
    }

    const newVersion = new AppVersion({
      version,
      buildNumber,
      downloadUrl,
      platform,
      changeLog,
      fileSize,
      isForceUpdate: isForceUpdate || false,
      isOptionalUpdate: isOptionalUpdate !== false,
      minRequiredVersion,
      status: 'draft'
    });

    await newVersion.save();

    res.status(201).json({
      success: true,
      message: 'Version created (draft)',
      version: newVersion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error creating version'
    });
  }
});

// ==========================================
// ADMIN - PUBLISH VERSION
// ==========================================

router.post('/admin/:versionId/publish', authenticateAdmin, async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await AppVersion.findByIdAndUpdate(
      versionId,
      {
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    // Log to admin logs
    const AdminLog = require('../models/AdminLog');
    await AdminLog.create({
      adminId: req.admin._id,
      action: 'publish_version',
      reason: `Published version ${version.version}`,
      details: {
        version: version.version,
        platform: version.platform,
        isForceUpdate: version.isForceUpdate
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: `Version ${version.version} published successfully!`,
      version
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error publishing version'
    });
  }
});

// ==========================================
// ADMIN - UPDATE VERSION
// ==========================================

router.put('/admin/:versionId', authenticateAdmin, async (req, res) => {
  try {
    const { versionId } = req.params;
    const updateData = req.body;

    const version = await AppVersion.findByIdAndUpdate(
      versionId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    res.json({
      success: true,
      message: 'Version updated',
      version
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error updating version'
    });
  }
});

// ==========================================
// ADMIN - DELETE VERSION
// ==========================================

router.delete('/admin/:versionId', authenticateAdmin, async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await AppVersion.findByIdAndUpdate(
      versionId,
      { status: 'archived' },
      { new: true }
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    res.json({
      success: true,
      message: 'Version archived'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting version'
    });
  }
});

// ==========================================
// ADMIN - FORCE UPDATE (PUSH)
// ==========================================

router.post('/admin/:versionId/force-update', authenticateAdmin, async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await AppVersion.findByIdAndUpdate(
      versionId,
      { isForceUpdate: true },
      { new: true }
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found'
      });
    }

    res.json({
      success: true,
      message: `Version ${version.version} marked as force update!`,
      version
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error setting force update'
    });
  }
});

module.exports = router;
