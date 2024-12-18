package controller

import (
	"net/http"

	"github.com/aprbq/se-team15/config"
	"github.com/aprbq/se-team15/entity"
	"github.com/gin-gonic/gin"
)

func GetCategory(c *gin.Context) {
	var category []entity.Category

	db := config.DB()

	db.Find(&category)

	c.JSON(http.StatusOK, &category)
}
