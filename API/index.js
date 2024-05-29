const express = require('express');
const app = express();
const port = 3000;
var cors = require('cors');

const bodyParser = require('body-parser');
var db = require('./db');
app.use(cors());


app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.json("{'mess: Hello'}")
})

// DỰ ÁN
app.get('/duan', (req, res) => {
    let sql = `SELECT * FROM duan ORDER BY id_duan `;
    db.query(sql, (err, data) => {
    if (err) res.json({'message':err});
    else res.json(data);
    })
});
app.get('/duan/:id', (req, res) => {
    let id = req.params.id;
    if(isNaN(id)==true) return res.json({'message':'Dự án không tồn tại'});
    let sql = `SELECT * FROM duan WHERE id_duan =?`;
    db.query(sql,id, (err, data) => {
    if (err) res.json({'message':err});
    else if (data.length==0) res.json({'message':'Dự án không có'});
    else res.json(data[0]);
    })
});
app.post('/duan', (req, res) => {
    
    let { ten_duan, ngay_batdau, tien, leader, thanh_vien } = req.body;
    console.log(req.body);
    if (!ten_duan || !ngay_batdau || !tien || !leader || !thanh_vien) {
        return res.status(400).json({ 'message': 'Invalid input' });
    }    
    let sql = `INSERT INTO duan (ten_duan, ngay_batdau, tien, leader, thanh_vien) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ten_duan, ngay_batdau, tien, leader, thanh_vien], (err, data) => {
        if (err) res.json({ 'message': err });
        else res.json({ 'message': 'Dự án được thêm thành công', 'id_duan': data.insertId });
    });
});
app.delete('/duan/:id', (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ 'message': 'Invalid project ID' });
    }
    let sql = `DELETE FROM duan WHERE id_duan = ?`;
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.json({ 'message': err });
        } else if (data.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Dự án không tồn tại' });
        } else {
            return res.json({ 'message': 'Dự án đã bị xóa' });
        }
    });
});

app.put('/duan/:id', (req, res) => {
    let id = req.params.id;
    let { ten_duan, ngay_batdau, tien, leader, thanh_vien } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ 'message': 'Invalid project ID' });
    }
    if (!ten_duan || !ngay_batdau || !tien || !leader || !thanh_vien) {
        return res.status(400).json({ 'message': 'Invalid input' });
    }

    let sql = `UPDATE duan SET ten_duan = ?, ngay_batdau = ?, tien = ?, leader = ?, thanh_vien = ? WHERE id_duan = ?`;
    db.query(sql, [ten_duan, ngay_batdau, tien, leader, thanh_vien, id], (err, data) => {
        if (err) {
            return res.json({ 'message': err });
        } else if (data.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Dự án không tồn tại' });
        } else {
            return res.json({ 'message': 'Dự án đã được cập nhật' });
        }
    });
});


// NHÂN VIÊN
app.get('/nhanvien', (req, res) => {
    let sql = `SELECT * FROM nhanvien`;
    db.query(sql, (err, data) => {
    if (err) res.json({'message':err});
    else res.json(data);
    })
});
app.get('/nhanvien/:id', (req, res) => {
    let id = req.params.id;
    if(isNaN(id)==true) return res.json({'message':'Nhân viên không tồn tại'});
    let sql = `SELECT * FROM nhanvien WHERE idnv =?`;
    db.query(sql,id, (err, data) => {
    if (err) res.json({'message':err});
    else if (data.length==0) res.json({'message':'Nhân viên không có'});
    else res.json(data[0]);
    })
});

// TASK
app.get('/task', (req, res) => {
    let sql = `SELECT * FROM task`;
    db.query(sql, (err, data) => {
    if (err) res.json({'message':err});
    else res.json(data);
    })
});
app.get('/task/:id',(req,res) =>{
    let id = req.params.id;
    if(isNaN(id)==true) return res.json({'message':'Task không tồn tại'});
    let sql = `SELECT * FROM task WHERE id_task =?`;
    db.query(sql,id, (err, data) => {
    if (err) res.json({'message':err});
    else if (data.length==0) res.json({'message':'Task không có'});
    else res.json(data[0]);
    })
})
app.post('/task',(req, res) => {
    let {ten_task,id_duan,idnv,mota,trang_thai,priority} = req.body;

    if (!ten_task ||!id_duan ||!idnv ||!mota ||!trang_thai ||!priority) {
        return res.status(400).json({ 'message': 'Invalid input' });
    }
    let sql = `INSERT INTO task (ten_task,id_duan,idnv,mota,trang_thai,priority) VALUES (?,?,?,?,?,?)`;
    db.query(sql, [ten_task,id_duan,idnv,mota,trang_thai,priority]),(err,data) => {
        if(err) res.json({'message':err});
        else res.json({'message':'Task đã được thêm vào thành công','id_task':data.insertId});    
}});
app.delete('/task/:id',(req, res) => {
    let id = req.params.id;
    if(isNaN(id)){
        return res.status(400).json({'message':'Invalid task ID'});
    }
    let sql = `DELETE FROM task WHERE id_task = ?`;
    db.query(sql, [id], (err, data) => {
        if (err){
            return res.status(err).json({'message':err});
        } else if(data.affectedRows ===0 ){
            return res.status(404).json({'message':'Task không tồn tại'});
        } else res.json({'message':'Task đã xóa'});   
});
});
app.put('/task/:id',(req, res) =>{
    let id = req.params.id;
    let {ten_task,id_duan,idnv,mota,trang_thai,priority} = req.body;

    if(isNaN(id)){
        return res.status(400).json({'message':'Invalid task ID'});
    }
    if(!ten_task ||!id_duan ||!idnv ||!mota ||!trang_thai ||!priority){
        return res.status(400).json({'message':'Invalid input'});
    }
    let sql = `UPDATE task SET ten_task =?, id_duan =?, idnv =?, mota =?, trang_thai =?, priority =? WHERE id_task =?`;
    db.query(sql, [ten_task,id_duan,idnv,mota,trang_thai,priority,id], (err, data) => {
        if(err){
            return res.status(err).json({'message':err});
        } else if(data.affectedRows ===0 ){
            return res.status(404).json({'message':'Task không tồn tại'});
        } else res.json({'message':'Task đã được cập nhật'});
});
});
app.listen(port, () => {
    console.log(`Ứng dụng đang chạy trên: ${port}`)
})
