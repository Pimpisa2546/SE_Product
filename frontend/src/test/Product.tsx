import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CategoryInterface } from "../interfaces/Category";

const Product: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>(["Supplier 1", "Supplier 2", "Supplier 3"]);

  // เปิด Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // ปิด Modal และรีเซ็ตฟอร์ม
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  /*// เมื่อกดบันทึก
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Product created:", values);
        message.success("สินค้าได้ถูกเพิ่มเรียบร้อยแล้ว!");
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error("Validation Failed:", error);
      });
  };*/

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // ตรวจสอบและดึงค่าจากฟอร์ม
      console.log("Product values:", values);
  
      // สร้าง FormData สำหรับการส่งรูปภาพและข้อมูล
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("supplier", values.supplier);
      if (values.image && values.image.file) {
        formData.append("image", values.image.file); // เพิ่มรูปภาพ
      }
  
      // ส่งข้อมูลไปยัง backend
      const response = await fetch("http://localhost:8080/product", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
  
      message.success("สินค้าได้ถูกเพิ่มเรียบร้อยแล้ว!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting product:", error);
      message.error("ไม่สามารถเพิ่มสินค้าได้");
    }
  };
  

  // ดึงข้อมูลประเภทสินค้า (Categories) จาก Backend
  const getcategory = async () => {
    try {
      const res = await fetch("http://localhost:8080/category"); //ดึงข้อมูลประเภทสินค้า
      if (!res.ok) {
        throw new Error("Failed to fetch category");
      }
      const data: CategoryInterface[] = await res.json();
      setCategory(data);
    } catch (error) {//เมื่อเกิดerror
      console.error("Error fetching category:", error);
      message.error("ไม่สามารถโหลดประเภทสินค้าได้");
    }
  };

  useEffect(() => {
    getcategory();
  }, []);

  //ดึงผู้ผลิตจากฐานข้อมูล
  // const getsupplier = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8080/supplier"); //ดึงข้อมูลประเภทสินค้า
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch supplier");
  //     }
  //     const data: SupplierInterface[] = await res.json();
  //     setSuppliers(data);
  //   } catch (error) {//เมื่อเกิดerror
  //     console.error("Error fetching supplier:", error);
  //     message.error("ไม่สามารถโหลดผู้ผลิตได้");
  //   }
  // };

  // useEffect(() => {
  //   getsupplier();
  // }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <Button type="primary" onClick={showModal}>
        เพิ่มสินค้า
      </Button>

      <Modal
        title="เพิ่มสินค้าใหม่"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* ชื่อสินค้า */}
          <Form.Item
            label="ชื่อสินค้า"
            name="productName"
            rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า!" }]}
          >
            <Input placeholder="กรอกชื่อสินค้า" />
          </Form.Item>

          {/* ราคา */}
          <Form.Item
            label="ราคา (บาท)"
            name="price"
            rules={[{ required: true, message: "กรุณากรอกราคา!" }]}
          >
            <Input
              min={0}
              placeholder="กรอกราคา"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* ประเภทสินค้า */}
          <Form.Item
            label="ประเภทสินค้า"
            name="category"
            rules={[{ required: true, message: "กรุณาเลือกประเภทสินค้า!" }]}
          >
            <Select placeholder="เลือกประเภทสินค้า" allowClear>
              {category.map((category) => (
                <Select.Option key={category.NameCategory} value={category.ID}>
                  {category.NameCategory}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* ผู้ผลิต */}
          <Form.Item
            label="ผู้ผลิต"
            name="supplier"
            rules={[{ required: true, message: "กรุณาเลือกผู้ผลิต!" }]}
          >
            <Select placeholder="เลือกผู้ผลิต" allowClear>
              {suppliers.map((supplier) => (
                <Select.Option key={supplier} value={supplier}>
                  {supplier}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* อัปโหลดรูปภาพ */}
          <Form.Item label="อัปโหลดรูปภาพ" name="image">
            <Upload
              name="productImage"
              listType="picture"
              maxCount={1}
              accept="image/*"
              beforeUpload={(file) => {
                console.log("Selected file:", file);
                return false; // Prevent automatic upload
              }}
            >
              <Button icon={<UploadOutlined />}>คลิกเพื่ออัปโหลดรูปภาพ</Button>
            </Upload>
          </Form.Item>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit">
              บันทึกสินค้า
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
