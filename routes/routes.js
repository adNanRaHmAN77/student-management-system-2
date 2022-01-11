const express = require("express");
const router = express.Router();
const Student = require("../models/students");
const multer = require("multer");
const fs = require("fs");

// image upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "--" + Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: fileStorage,
}).single("photo");

// insert a student into database route
router.post("/add", upload, (req, res) => {
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    photo: req.file.filename,
    degree: req.body.degree,
  });
  student.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Student added successfully!",
      };
      res.redirect("/");
    }
  });
});

// Get all students route
router.get("/", (req, res) => {
  Student.find().exec((err, students) => {
      if(err) {
          res.json({ message: err.message });
      } else {
          res.render('index', {
              title: 'Home Page',
              students: students,
          });
      }
  })
});

router.get("/add", (req, res) => {
  res.render("add_students", { title: "Add Students" });
});

// view student detail route
router.get('/view/:id' , (req, res) => {
    let id = req.params.id;
    Student.findById(id, (err, student) => {
        if(!err) {
            res.render('view_student', {
                title: 'View Student Detail',
                student: student,
            })
        }
    })
})

// Edit a student route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    Student.findById(id, (err, student) => {
        if(err) {
            res.redirect('/');
        } else {
            if(student == null) {
                res.redirect('/');
            } else {
                res.render('edit_students', {
                    title: 'Edit Student',
                    student: student,
                });
            }
        }
    });
});

// Update user route
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_photo = '';

    if(req.file) {
        new_photo = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_photo);
        } catch(err) {
            console.log(err);
        }
    } else {
        new_photo = req.body.old_photo;
    }

    Student.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        degree: req.body.degree,
        photo: new_photo,
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message , type: 'danger'})
        } else {
            req.session.message = {
                type: 'success',
                message: 'Student updated successfully!'
            };

            res.redirect('/');

        }
    });
});

// Delete User Route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    Student.findByIdAndRemove(id, (err, result) => {
        if(result.photo != '') {
            try {
                fs.unlinkSync('./uploads/' + result.photo);
            } catch(err) {
                console.log(err);
            }
        }
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'info',
                message: 'Student deleted successfully!'
            }
            res.redirect('/');
        }
    })
})

module.exports = router;
