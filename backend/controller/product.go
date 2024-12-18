package controller

import (
	"net/http"

	"github.com/aprbq/se-team15/config"
	"github.com/aprbq/se-team15/entity"
	"github.com/gin-gonic/gin"
)

func GetProduct(c *gin.Context) {
	var product []entity.Product

	db := config.DB()
	result := db.Preload("Category").Find(&product)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, &product)
}

func CreateProduct(c *gin.Context) {
	var product entity.Product

	// bind เข้าตัวแปร product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	/*// ตรวจสอบว่า Seller มีอยู่ในระบบหรือไม่
	var seller entity.Seller
	if err := db.First(&seller, product.SellerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seller not found"})
		return
	}*/

	// สร้าง Product พร้อมกับข้อมูล Seller
	p := entity.Product{
		ProductName:     product.ProductName,
		ProductPrice:    product.ProductPrice,
		Product_Picture: product.Product_Picture,
		CategoryID:      product.CategoryID,
		//SellerID:        seller.ID, // เชื่อมกับ Seller ที่มีอยู่
	}

	// บันทึก Product
	if err := db.Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": p})
}

func DeleteProducts(c *gin.Context) { //ลบข้อมูลตาม id
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM products WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
