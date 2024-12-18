package entity

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	ProductName     string `gorm:"not null"`
	Product_Picture string `gorm:"type:longtext"`
	ProductPrice    float32

	OrderItem []OrderItem `gorm:"foreignKey:ProductID"`

	EmployeeID *uint
	Employee   Employee `gorm:"foriegnKey:EmployeeID"`

	CategoryID uint
	Category   Category `gorm:"foreignKey:CategoryID"`
}
