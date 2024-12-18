package entity

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	NameCategory string

	Product []Product `gorm:"foreignKey:CategoryID"`
}
